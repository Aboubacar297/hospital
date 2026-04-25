from sqlalchemy.orm import Session
from ..models.audit import AuditLog

def create_audit_entry(db: Session, user_id: int, action: str, table: str, desc: str):
    log = AuditLog(
        user_id=user_id,
        action=action,
        table_visee=table,
        description=desc
    )
    db.add(log)
    # Note: On ne fait pas forcément db.commit() ici, 
    # il sera fait par la route principale