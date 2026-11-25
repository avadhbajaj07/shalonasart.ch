import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createClient } from '@supabase/supabase-js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

function loadEnv() {
  const envPath = path.join(rootDir, '.env.local');
  if (fs.existsSync(envPath)) {
    const lines = fs.readFileSync(envPath, 'utf8').split('\n');
    for (const line of lines) {
      const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
      if (match) {
        const key = match[1];
        let val = match[2] || '';
        if (val.startsWith('"') && val.endsWith('"')) val = val.slice(1, -1);
        if (val.startsWith("'") && val.endsWith("'")) val = val.slice(1, -1);
        process.env[key] = val.trim();
      }
    }
  }
}

loadEnv();

const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://mhiyjqcwdbqpmplghewi.supabase.co';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!supabaseKey) {
  console.error('SUPABASE_SERVICE_ROLE_KEY is required in .env.local');
  process.exit(1);
}
const adminEmail = process.env.ADMIN_EMAIL || 'info@shalonasart.ch';
const adminPassword = process.env.ADMIN_PASSWORD || 'Shalona@Studio#2026!';

const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  },
});

async function main() {
  console.log(`Checking admin user: ${adminEmail}...`);

  const { data: usersData, error: listError } = await supabase.auth.admin.listUsers();
  if (listError) {
    console.error('Failed to list users:', listError.message);
    process.exit(1);
  }

  const existing = usersData.users.find(u => u.email === adminEmail);

  if (existing) {
    console.log(`Admin user already exists (ID: ${existing.id}). Updating password and confirming email...`);
    const { data: updated, error: updateError } = await supabase.auth.admin.updateUserById(existing.id, {
      password: adminPassword,
      email_confirm: true,
      user_metadata: { role: 'admin', name: 'Shalona' },
    });

    if (updateError) {
      console.error('Failed to update admin user:', updateError.message);
      process.exit(1);
    }
    console.log('Admin user updated successfully.');
  } else {
    console.log(`Creating new admin user: ${adminEmail}...`);
    const { data: created, error: createError } = await supabase.auth.admin.createUser({
      email: adminEmail,
      password: adminPassword,
      email_confirm: true,
      user_metadata: { role: 'admin', name: 'Shalona' },
    });

    if (createError) {
      console.error('Failed to create admin user:', createError.message);
      process.exit(1);
    }
    console.log('Admin user created successfully (ID:', created.user?.id, ')');
  }

  console.log(`\nAdmin Credentials:`);
  console.log(`Email:    ${adminEmail}`);
  console.log(`Password: ${adminPassword}`);
  console.log(`Role:     admin\n`);
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
