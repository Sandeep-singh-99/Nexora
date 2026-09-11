"""create users table

Revision ID: a474812bcd76
Revises: 
Create Date: 2026-09-11 17:58:59.452824

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'a474812bcd76'
down_revision: Union[str, Sequence[str], None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    # Drop existing foreign key constraints before altering referenced/referencing column types
    op.drop_constraint('email_verification_tokens_user_id_fkey', 'email_verification_tokens', type_='foreignkey')
    op.drop_constraint('password_reset_tokens_user_id_fkey', 'password_reset_tokens', type_='foreignkey')
    op.drop_constraint('refresh_sessions_user_id_fkey', 'refresh_sessions', type_='foreignkey')

    # Alter users table primary key first
    op.add_column('users', sa.Column('is_active', sa.Boolean(), nullable=False, server_default=sa.text('true')))
    op.alter_column('users', 'id',
               existing_type=sa.VARCHAR(length=36),
               type_=sa.UUID(),
               existing_nullable=False,
               postgresql_using='id::uuid')
    op.create_index(op.f('ix_users_id'), 'users', ['id'], unique=False)

    # Alter email_verification_tokens
    op.add_column('email_verification_tokens', sa.Column('token_hash', sa.String(length=64), nullable=False, server_default=''))
    op.add_column('email_verification_tokens', sa.Column('used_at', sa.DateTime(timezone=True), nullable=True))
    op.alter_column('email_verification_tokens', 'id',
               existing_type=sa.VARCHAR(length=36),
               type_=sa.UUID(),
               existing_nullable=False,
               postgresql_using='id::uuid')
    op.alter_column('email_verification_tokens', 'user_id',
               existing_type=sa.VARCHAR(length=36),
               type_=sa.UUID(),
               existing_nullable=False,
               postgresql_using='user_id::uuid')
    op.drop_index(op.f('ix_email_verification_tokens_expires_at'), table_name='email_verification_tokens')
    op.drop_index(op.f('ix_email_verification_tokens_hashed_token'), table_name='email_verification_tokens')
    op.drop_index(op.f('ix_email_verification_tokens_is_used'), table_name='email_verification_tokens')
    op.create_index(op.f('ix_email_verification_tokens_token_hash'), 'email_verification_tokens', ['token_hash'], unique=True)
    op.drop_column('email_verification_tokens', 'is_used')
    op.drop_column('email_verification_tokens', 'hashed_token')

    # Alter password_reset_tokens
    op.add_column('password_reset_tokens', sa.Column('token_hash', sa.String(length=64), nullable=False, server_default=''))
    op.add_column('password_reset_tokens', sa.Column('used_at', sa.DateTime(timezone=True), nullable=True))
    op.alter_column('password_reset_tokens', 'id',
               existing_type=sa.VARCHAR(length=36),
               type_=sa.UUID(),
               existing_nullable=False,
               postgresql_using='id::uuid')
    op.alter_column('password_reset_tokens', 'user_id',
               existing_type=sa.VARCHAR(length=36),
               type_=sa.UUID(),
               existing_nullable=False,
               postgresql_using='user_id::uuid')
    op.drop_index(op.f('ix_password_reset_tokens_expires_at'), table_name='password_reset_tokens')
    op.drop_index(op.f('ix_password_reset_tokens_hashed_token'), table_name='password_reset_tokens')
    op.drop_index(op.f('ix_password_reset_tokens_is_used'), table_name='password_reset_tokens')
    op.create_index(op.f('ix_password_reset_tokens_token_hash'), 'password_reset_tokens', ['token_hash'], unique=True)
    op.drop_column('password_reset_tokens', 'is_used')
    op.drop_column('password_reset_tokens', 'hashed_token')

    # Alter refresh_sessions
    op.add_column('refresh_sessions', sa.Column('refresh_token_hash', sa.String(length=64), nullable=False, server_default=''))
    op.alter_column('refresh_sessions', 'id',
               existing_type=sa.VARCHAR(length=36),
               type_=sa.UUID(),
               existing_nullable=False,
               postgresql_using='id::uuid')
    op.alter_column('refresh_sessions', 'user_id',
               existing_type=sa.VARCHAR(length=36),
               type_=sa.UUID(),
               existing_nullable=False,
               postgresql_using='user_id::uuid')
    op.alter_column('refresh_sessions', 'family_id',
               existing_type=sa.VARCHAR(length=255),
               type_=sa.UUID(),
               existing_nullable=False,
               postgresql_using='family_id::uuid')
    op.drop_index(op.f('idx_refresh_user_family'), table_name='refresh_sessions')
    op.drop_index(op.f('ix_refresh_sessions_is_revoked'), table_name='refresh_sessions')
    op.drop_index(op.f('ix_refresh_sessions_jti'), table_name='refresh_sessions')
    op.create_index(op.f('ix_refresh_sessions_refresh_token_hash'), 'refresh_sessions', ['refresh_token_hash'], unique=False)
    op.drop_column('refresh_sessions', 'jti')
    op.drop_column('refresh_sessions', 'hashed_token')

    # Re-create foreign key constraints with updated UUID types
    op.create_foreign_key('email_verification_tokens_user_id_fkey', 'email_verification_tokens', 'users', ['user_id'], ['id'], ondelete='CASCADE')
    op.create_foreign_key('password_reset_tokens_user_id_fkey', 'password_reset_tokens', 'users', ['user_id'], ['id'], ondelete='CASCADE')
    op.create_foreign_key('refresh_sessions_user_id_fkey', 'refresh_sessions', 'users', ['user_id'], ['id'], ondelete='CASCADE')


def downgrade() -> None:
    """Downgrade schema."""
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_index(op.f('ix_users_id'), table_name='users')
    op.alter_column('users', 'id',
               existing_type=sa.UUID(),
               type_=sa.VARCHAR(length=36),
               existing_nullable=False)
    op.drop_column('users', 'is_active')
    op.add_column('refresh_sessions', sa.Column('hashed_token', sa.VARCHAR(length=255), autoincrement=False, nullable=False))
    op.add_column('refresh_sessions', sa.Column('jti', sa.VARCHAR(length=255), autoincrement=False, nullable=False))
    op.drop_index(op.f('ix_refresh_sessions_refresh_token_hash'), table_name='refresh_sessions')
    op.create_index(op.f('ix_refresh_sessions_jti'), 'refresh_sessions', ['jti'], unique=True)
    op.create_index(op.f('ix_refresh_sessions_is_revoked'), 'refresh_sessions', ['is_revoked'], unique=False)
    op.create_index(op.f('idx_refresh_user_family'), 'refresh_sessions', ['user_id', 'family_id'], unique=False)
    op.alter_column('refresh_sessions', 'family_id',
               existing_type=sa.UUID(),
               type_=sa.VARCHAR(length=255),
               existing_nullable=False)
    op.alter_column('refresh_sessions', 'user_id',
               existing_type=sa.UUID(),
               type_=sa.VARCHAR(length=36),
               existing_nullable=False)
    op.alter_column('refresh_sessions', 'id',
               existing_type=sa.UUID(),
               type_=sa.VARCHAR(length=36),
               existing_nullable=False)
    op.drop_column('refresh_sessions', 'refresh_token_hash')
    op.add_column('password_reset_tokens', sa.Column('hashed_token', sa.VARCHAR(length=255), autoincrement=False, nullable=False))
    op.add_column('password_reset_tokens', sa.Column('is_used', sa.BOOLEAN(), autoincrement=False, nullable=False))
    op.drop_index(op.f('ix_password_reset_tokens_token_hash'), table_name='password_reset_tokens')
    op.create_index(op.f('ix_password_reset_tokens_is_used'), 'password_reset_tokens', ['is_used'], unique=False)
    op.create_index(op.f('ix_password_reset_tokens_hashed_token'), 'password_reset_tokens', ['hashed_token'], unique=False)
    op.create_index(op.f('ix_password_reset_tokens_expires_at'), 'password_reset_tokens', ['expires_at'], unique=False)
    op.alter_column('password_reset_tokens', 'user_id',
               existing_type=sa.UUID(),
               type_=sa.VARCHAR(length=36),
               existing_nullable=False)
    op.alter_column('password_reset_tokens', 'id',
               existing_type=sa.UUID(),
               type_=sa.VARCHAR(length=36),
               existing_nullable=False)
    op.drop_column('password_reset_tokens', 'used_at')
    op.drop_column('password_reset_tokens', 'token_hash')
    op.add_column('email_verification_tokens', sa.Column('hashed_token', sa.VARCHAR(length=255), autoincrement=False, nullable=False))
    op.add_column('email_verification_tokens', sa.Column('is_used', sa.BOOLEAN(), autoincrement=False, nullable=False))
    op.drop_index(op.f('ix_email_verification_tokens_token_hash'), table_name='email_verification_tokens')
    op.create_index(op.f('ix_email_verification_tokens_is_used'), 'email_verification_tokens', ['is_used'], unique=False)
    op.create_index(op.f('ix_email_verification_tokens_hashed_token'), 'email_verification_tokens', ['hashed_token'], unique=False)
    op.create_index(op.f('ix_email_verification_tokens_expires_at'), 'email_verification_tokens', ['expires_at'], unique=False)
    op.alter_column('email_verification_tokens', 'user_id',
               existing_type=sa.UUID(),
               type_=sa.VARCHAR(length=36),
               existing_nullable=False)
    op.alter_column('email_verification_tokens', 'id',
               existing_type=sa.UUID(),
               type_=sa.VARCHAR(length=36),
               existing_nullable=False)
    op.drop_column('email_verification_tokens', 'used_at')
    op.drop_column('email_verification_tokens', 'token_hash')
    # ### end Alembic commands ###
