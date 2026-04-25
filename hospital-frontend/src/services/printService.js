import { jsPDF } from "jspdf";

/**
 * ✅ EXPORT GÉNÉRIQUE (Pour corriger l'erreur Webpack)
 * Cette fonction sert de pont pour tes composants qui appellent 'generatePDF'
 */
export const generatePDF = (type, data) => {
  // Si data est une consultation standard, on l'imprime
  return generatePrescriptionPDF(data);
};

/**
 * ✅ GÉNÉRATEUR D'ORDONNANCE
 * Supporte le format (consultation, patient, doctorName) OU le format objet unique
 */
export const generatePrescriptionPDF = (arg1, arg2 = null, arg3 = "Dr. Expert IA") => {
  const doc = new jsPDF();
  
  // -- Logique d'extraction des données --
  // On s'adapte si l'appel vient de ViewFullDme (3 args) ou FormConsultation (1 arg)
  const isTripleArgs = arg2 !== null;
  const consultation = isTripleArgs ? arg1 : arg1;
  const patient = isTripleArgs ? arg2 : { nom: arg1.nom_patient || "Sacko", prenom: "", age: "N/A" };
  const doctorName = isTripleArgs ? arg3 : (arg1.medecin || "Dr. Expert IA");

  const dateStr = consultation.date_creation 
    ? new Date(consultation.date_creation).toLocaleDateString('fr-FR')
    : new Date().toLocaleDateString('fr-FR');

  // --- 1. EN-TÊTE (Header Premium) ---
  doc.setFont("helvetica", "bold");
  doc.setFontSize(22);
  doc.setTextColor(79, 70, 229); // Indigo AI CURA
  doc.text("AI CURA", 105, 20, { align: "center" });
  
  doc.setFontSize(10);
  doc.setTextColor(100);
  doc.setFont("helvetica", "normal");
  doc.text("Intelligence Artificielle & Santé Connectée", 105, 27, { align: "center" });
  doc.text("SIH Connecté - Faculté des Sciences, Rabat", 105, 32, { align: "center" });

  doc.setDrawColor(79, 70, 229);
  doc.line(20, 40, 190, 40); 

  // --- 2. INFOS PATIENT & DATE ---
  doc.setFontSize(11);
  doc.setTextColor(0);
  doc.text(`Fait à Rabat, le : ${dateStr}`, 140, 50);
  
  doc.setFont("helvetica", "bold");
  doc.text("PATIENT :", 20, 60);
  doc.setFont("helvetica", "normal");
  doc.text(`${String(patient.nom).toUpperCase()} ${patient.prenom || ""}`, 45, 60);
  doc.text(`Identifiant : #${consultation.patient_id || consultation.id || 'DME'}`, 20, 67);

  // --- 3. CONTENU MÉDICAL (La Consultation) ---
  doc.setDrawColor(226, 232, 240);
  doc.setFillColor(248, 250, 252);
  doc.roundedRect(20, 80, 170, 100, 3, 3, "FD");

  doc.setFont("helvetica", "bold");
  doc.setTextColor(79, 70, 229);
  doc.text("ORDONNANCE / PRESCRIPTIONS :", 30, 92);
  
  doc.setFont("helvetica", "normal");
  doc.setTextColor(30, 41, 59);
  const prescriptions = consultation.prescriptions || "Aucun traitement prescrit.";
  const lines = doc.splitTextToSize(prescriptions, 150);
  doc.text(lines, 30, 102);

  // --- 4. SIGNATURE ---
  doc.setFont("helvetica", "italic");
  doc.setTextColor(100);
  doc.text("Signature et cachet du médecin :", 120, 200);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(0);
  doc.text(`Dr. ${doctorName}`, 120, 210);

  // --- 5. BAS DE PAGE (Certification) ---
  doc.setFontSize(8);
  doc.setTextColor(160);
  doc.text("Document numérique certifié par AI CURA v1.0 - Rabat, Maroc", 105, 285, { align: "center" });

  // Téléchargement
  const fileName = `Ordonnance_${patient.nom}_${new Date().getTime()}.pdf`;
  doc.save(fileName);
};