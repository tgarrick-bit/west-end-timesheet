-- West End Workforce Database Schema
-- This file contains the complete database structure for the timesheet and expense tracking system

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Create custom types
CREATE TYPE user_role AS ENUM ('employee', 'client_approver', 'admin', 'payroll');
CREATE TYPE approval_status AS ENUM ('pending', 'approved', 'rejected');
CREATE TYPE timesheet_status AS ENUM ('draft', 'submitted', 'client_approved', 'payroll_approved', 'rejected');
CREATE TYPE expense_status AS ENUM ('draft', 'submitted', 'client_approved', 'payroll_approved', 'rejected');

-- Users table (employees, client approvers, admins, payroll)
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    role user_role NOT NULL DEFAULT 'employee',
    client_id UUID, -- Only for client_approver role
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Clients table (external companies)
CREATE TABLE clients (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    contact_person VARCHAR(255) NOT NULL,
    contact_email VARCHAR(255) NOT NULL,
    contact_phone VARCHAR(50),
    address TEXT,
    time_tracking_method VARCHAR(20) NOT NULL DEFAULT 'detailed' CHECK (time_tracking_method IN ('detailed', 'simple')),
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Projects table
CREATE TABLE projects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    client_id UUID NOT NULL REFERENCES clients(id),
    description TEXT,
    start_date DATE NOT NULL,
    end_date DATE,
    is_active BOOLEAN NOT NULL DEFAULT true,
    status VARCHAR(20) NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'completed', 'on-hold')),
    budget DECIMAL(10,2),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Project assignments (which users work on which projects)
CREATE TABLE project_assignments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id),
    project_id UUID NOT NULL REFERENCES projects(id),
    start_date DATE NOT NULL,
    end_date DATE,
    hourly_rate DECIMAL(10,2) NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, project_id, start_date)
);

-- Tasks table (project-specific tasks/codes)
CREATE TABLE tasks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID NOT NULL REFERENCES projects(id),
    name VARCHAR(255) NOT NULL,
    code VARCHAR(50) NOT NULL,
    description TEXT,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(project_id, code)
);

-- Time entries (daily time tracking)
CREATE TABLE time_entries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id),
    project_id UUID NOT NULL REFERENCES projects(id),
    task_id UUID NOT NULL REFERENCES tasks(id),
    date DATE NOT NULL,
    start_time TIME,
    end_time TIME,
    total_hours INTEGER NOT NULL, -- Stored in minutes for precision
    notes TEXT,
    location VARCHAR(255),
    is_submitted BOOLEAN NOT NULL DEFAULT false,
    is_approved BOOLEAN NOT NULL DEFAULT false,
    approved_by UUID REFERENCES users(id),
    approved_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Timesheets (weekly aggregation)
CREATE TABLE timesheets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id),
    week_start_date DATE NOT NULL,
    week_end_date DATE NOT NULL,
    total_hours INTEGER NOT NULL DEFAULT 0, -- Stored in minutes
    status timesheet_status NOT NULL DEFAULT 'draft',
    submitted_at TIMESTAMP WITH TIME ZONE,
    client_approved_at TIMESTAMP WITH TIME ZONE,
    payroll_approved_at TIMESTAMP WITH TIME ZONE,
    rejected_at TIMESTAMP WITH TIME ZONE,
    rejection_reason TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, week_start_date)
);

-- Expense categories
CREATE TABLE expense_categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    spending_limit DECIMAL(10,2),
    is_billable BOOLEAN NOT NULL DEFAULT true,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Expense items
CREATE TABLE expense_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id),
    project_id UUID REFERENCES projects(id), -- Optional, can be personal expense
    category_id UUID NOT NULL REFERENCES expense_categories(id),
    date DATE NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    description TEXT NOT NULL,
    receipt_url TEXT,
    is_billable BOOLEAN NOT NULL DEFAULT true,
    is_submitted BOOLEAN NOT NULL DEFAULT false,
    is_approved BOOLEAN NOT NULL DEFAULT false,
    approved_by UUID REFERENCES users(id),
    approved_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Expense reports (monthly aggregation)
CREATE TABLE expense_reports (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id),
    month VARCHAR(7) NOT NULL, -- Format: YYYY-MM
    year INTEGER NOT NULL,
    total_amount DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    status expense_status NOT NULL DEFAULT 'draft',
    submitted_at TIMESTAMP WITH TIME ZONE,
    client_approved_at TIMESTAMP WITH TIME ZONE,
    payroll_approved_at TIMESTAMP WITH TIME ZONE,
    rejected_at TIMESTAMP WITH TIME ZONE,
    rejection_reason TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, month, year)
);

-- Rate tables for flexible rate management
CREATE TABLE rate_tables (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Rate entries (specific rates for user+project combinations)
CREATE TABLE rate_entries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    rate_table_id UUID NOT NULL REFERENCES rate_tables(id),
    user_id UUID REFERENCES users(id), -- Optional, for user-specific rates
    project_id UUID REFERENCES projects(id), -- Optional, for project-specific rates
    hourly_rate DECIMAL(10,2) NOT NULL,
    effective_date DATE NOT NULL,
    end_date DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Approvals table (multi-level approval workflow)
CREATE TABLE approvals (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    approver_id UUID NOT NULL REFERENCES users(id),
    approver_type VARCHAR(20) NOT NULL CHECK (approver_type IN ('client', 'payroll')),
    timesheet_id UUID REFERENCES timesheets(id),
    expense_report_id UUID REFERENCES expense_reports(id),
    status approval_status NOT NULL DEFAULT 'pending',
    comments TEXT,
    approved_at TIMESTAMP WITH TIME ZONE,
    rejected_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    CHECK (
        (timesheet_id IS NOT NULL AND expense_report_id IS NULL) OR
        (timesheet_id IS NULL AND expense_report_id IS NOT NULL)
    )
);

-- Create indexes for better performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_client_id ON users(client_id);
CREATE INDEX idx_projects_client_id ON projects(client_id);
CREATE INDEX idx_project_assignments_user_id ON project_assignments(user_id);
CREATE INDEX idx_project_assignments_project_id ON project_assignments(project_id);
CREATE INDEX idx_tasks_project_id ON tasks(project_id);
CREATE INDEX idx_time_entries_user_id ON time_entries(user_id);
CREATE INDEX idx_time_entries_project_id ON time_entries(project_id);
CREATE INDEX idx_time_entries_date ON time_entries(date);
CREATE INDEX idx_timesheets_user_id ON timesheets(user_id);
CREATE INDEX idx_timesheets_status ON timesheets(status);
CREATE INDEX idx_expense_items_user_id ON expense_items(user_id);
CREATE INDEX idx_expense_items_project_id ON expense_items(project_id);
CREATE INDEX idx_expense_items_date ON expense_items(date);
CREATE INDEX idx_expense_reports_user_id ON expense_reports(user_id);
CREATE INDEX idx_expense_reports_status ON expense_reports(status);
CREATE INDEX idx_approvals_approver_id ON approvals(approver_id);
CREATE INDEX idx_approvals_status ON approvals(status);
CREATE INDEX idx_approvals_timesheet_id ON approvals(timesheet_id);
CREATE INDEX idx_approvals_expense_report_id ON approvals(expense_report_id);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply updated_at trigger to all tables
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_clients_updated_at BEFORE UPDATE ON clients FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_projects_updated_at BEFORE UPDATE ON projects FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_project_assignments_updated_at BEFORE UPDATE ON project_assignments FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_tasks_updated_at BEFORE UPDATE ON tasks FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_time_entries_updated_at BEFORE UPDATE ON time_entries FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_timesheets_updated_at BEFORE UPDATE ON timesheets FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_expense_categories_updated_at BEFORE UPDATE ON expense_categories FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_expense_items_updated_at BEFORE UPDATE ON expense_items FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_expense_reports_updated_at BEFORE UPDATE ON expense_reports FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_rate_tables_updated_at BEFORE UPDATE ON rate_tables FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_rate_entries_updated_at BEFORE UPDATE ON rate_entries FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_approvals_updated_at BEFORE UPDATE ON approvals FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert seed data for testing
INSERT INTO clients (id, name, contact_person, contact_email, contact_phone) VALUES
    (uuid_generate_v4(), 'Acme Corporation', 'HR Manager', 'hr@acme.com', '+1-555-0101'),
    (uuid_generate_v4(), 'TechStart Inc', 'Finance Manager', 'finance@techstart.com', '+1-555-0102'),
    (uuid_generate_v4(), 'Global Solutions', 'Admin Manager', 'admin@globalsolutions.com', '+1-555-0103');

-- Insert expense categories
INSERT INTO expense_categories (name, description, spending_limit, is_billable) VALUES
    ('Meals', 'Food and beverage expenses', 50.00, true),
    ('Travel', 'Transportation and accommodation', 200.00, true),
    ('Supplies', 'Office and work supplies', 100.00, true),
    ('Equipment', 'Tools and equipment', 500.00, true),
    ('Training', 'Professional development', 1000.00, false);

-- Insert sample projects
INSERT INTO projects (name, client_id, description, start_date, budget) VALUES
    ('Website Redesign', (SELECT id FROM clients WHERE name = 'Acme Corporation'), 'Complete website overhaul and redesign', '2024-01-01', 15000.00),
    ('Mobile App Development', (SELECT id FROM clients WHERE name = 'TechStart Inc'), 'iOS and Android app development', '2024-02-01', 25000.00),
    ('Data Migration', (SELECT id FROM clients WHERE name = 'Global Solutions'), 'Legacy system data migration', '2024-03-01', 8000.00);

-- Insert sample tasks
INSERT INTO tasks (project_id, name, code, description) VALUES
    ((SELECT id FROM projects WHERE name = 'Website Redesign'), 'Design', 'DESIGN', 'UI/UX design work'),
    ((SELECT id FROM projects WHERE name = 'Website Redesign'), 'Development', 'DEV', 'Frontend and backend development'),
    ((SELECT id FROM projects WHERE name = 'Website Redesign'), 'Testing', 'TEST', 'Quality assurance and testing'),
    ((SELECT id FROM projects WHERE name = 'Mobile App Development'), 'iOS Development', 'IOS', 'iPhone app development'),
    ((SELECT id FROM projects WHERE name = 'Mobile App Development'), 'Android Development', 'ANDROID', 'Android app development'),
    ((SELECT id FROM projects WHERE name = 'Data Migration'), 'Analysis', 'ANALYSIS', 'Data analysis and mapping'),
    ((SELECT id FROM projects WHERE name = 'Data Migration'), 'Migration', 'MIGRATE', 'Data migration execution');

-- Insert admin user (password: admin123)
INSERT INTO users (id, email, first_name, last_name, role) VALUES
    (uuid_generate_v4(), 'admin@westendworkforce.com', 'System', 'Administrator', 'admin');

-- Insert sample employee users (passwords: employee123)
INSERT INTO users (id, email, first_name, last_name, role) VALUES
    (uuid_generate_v4(), 'john.doe@westendworkforce.com', 'John', 'Doe', 'employee'),
    (uuid_generate_v4(), 'jane.smith@westendworkforce.com', 'Jane', 'Smith', 'employee'),
    (uuid_generate_v4(), 'mike.johnson@westendworkforce.com', 'Mike', 'Johnson', 'employee');

-- Insert sample client approver users (passwords: client123)
INSERT INTO users (id, email, first_name, last_name, role, client_id) VALUES
    (uuid_generate_v4(), 'hr@acme.com', 'HR', 'Manager', 'client_approver', (SELECT id FROM clients WHERE name = 'Acme Corporation')),
    (uuid_generate_v4(), 'finance@techstart.com', 'Finance', 'Manager', 'client_approver', (SELECT id FROM clients WHERE name = 'TechStart Inc')),
    (uuid_generate_v4(), 'admin@globalsolutions.com', 'Admin', 'Manager', 'client_approver', (SELECT id FROM clients WHERE name = 'Global Solutions'));

-- Insert sample payroll user (password: payroll123)
INSERT INTO users (id, email, first_name, last_name, role) VALUES
    (uuid_generate_v4(), 'payroll@westendworkforce.com', 'Payroll', 'Manager', 'payroll');

-- Insert project assignments
INSERT INTO project_assignments (user_id, project_id, start_date, hourly_rate) VALUES
    ((SELECT id FROM users WHERE email = 'john.doe@westendworkforce.com'), (SELECT id FROM projects WHERE name = 'Website Redesign'), '2024-01-01', 75.00),
    ((SELECT id FROM users WHERE email = 'jane.smith@westendworkforce.com'), (SELECT id FROM projects WHERE name = 'Mobile App Development'), '2024-02-01', 85.00),
    ((SELECT id FROM users WHERE email = 'mike.johnson@westendworkforce.com'), (SELECT id FROM projects WHERE name = 'Data Migration'), '2024-03-01', 65.00);

-- Create storage buckets for file uploads
-- Note: This requires Supabase storage to be enabled
-- INSERT INTO storage.buckets (id, name, public) VALUES ('receipts', 'receipts', true);

-- Grant necessary permissions
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO authenticated;
GRANT ALL PRIVILEGES ON ALL FUNCTIONS IN SCHEMA public TO authenticated;




