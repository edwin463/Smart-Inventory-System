"""Add is_admin to users

Revision ID: 65a83b477e0b
Revises: 95ffb282cd14
Create Date: 2025-05-06 14:33:36.013734
"""

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '65a83b477e0b'
down_revision = '95ffb282cd14'
branch_labels = None
depends_on = None


def upgrade():
    # Add 'is_admin' column with default=False to avoid SQLite NOT NULL issue
    with op.batch_alter_table('users', schema=None) as batch_op:
        batch_op.add_column(
            sa.Column('is_admin', sa.Boolean(), nullable=False, server_default=sa.false())
        )


def downgrade():
    # Drop 'is_admin' column if downgrading
    with op.batch_alter_table('users', schema=None) as batch_op:
        batch_op.drop_column('is_admin')
