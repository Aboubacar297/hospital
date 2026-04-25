from sqlalchemy.orm import Session
from sqlalchemy import func
from datetime import datetime, timedelta
from ..models.rdv import RendezVous # Import relatif crucial
import statistics

class PredictionService:
    @staticmethod
    def predire_flux_patients(db: Session):
        """
        Calcule une tendance de flux de patients basée sur les 7 derniers jours
        pour prédire le nombre de patients du lendemain.
        """
        # 1. Récupération des données des 7 derniers jours
        aujourdhui = datetime.now().date()
        sept_jours_avant = aujourdhui - timedelta(days=7)

        # Requête pour compter les RDV par jour
        stats = db.query(
            func.count(RendezVous.id).label('total'),
            RendezVous.date
        ).filter(RendezVous.date >= sept_jours_avant, RendezVous.date < aujourdhui)\
         .group_by(RendezVous.date)\
         .all()

        # 2. Préparation des données pour la régression
        # On transforme les dates en index (0, 1, 2...) pour le calcul
        donnees_y = [s.total for s in stats]
        donnees_x = list(range(len(donnees_y)))

        # S'il n'y a pas assez de données, on renvoie une estimation par défaut
        if len(donnees_y) < 2:
            return {
                "prediction_lendemain": 5, 
                "message": "Données insuffisantes pour une précision optimale",
                "tendance": "stable"
            }

        # 3. Algorithme de Régression Linéaire Simple (y = ax + b)
        mean_x = statistics.mean(donnees_x)
        mean_y = statistics.mean(donnees_y)

        # Calcul de la pente (a)
        numerateur = sum((x - mean_x) * (y - mean_y) for x, y in zip(donnees_x, donnees_y))
        denominateur = sum((x - mean_x)**2 for x in donnees_x)
        
        pente = numerateur / denominateur if denominateur != 0 else 0
        ordonnee = mean_y - (pente * mean_x)

        # Prédiction pour le jour suivant (index suivant dans la liste)
        prochain_x = len(donnees_y)
        prediction = max(0, round(pente * prochain_x + ordonnee))

        return {
            "prediction_lendemain": prediction,
            "historique_7_jours": donnees_y,
            "tendance": "hausse" if pente > 0 else "baisse" if pente < 0 else "stable",
            "pente": round(pente, 2)
        }