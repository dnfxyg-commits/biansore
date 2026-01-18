import bcrypt from "bcryptjs";
import { supabase } from "../../../server/supabaseClient.mjs";

const username = "cs";        // 管理员用户名
const password = "123456";    // 管理员密码（仅本地测试）
const role = "admin";         // 角色，目前系统使用 'admin'

async function main() {
  console.log("Creating initial admin user...");

  // 1. 检查是否已存在同名用户
  const { data: existing, error: existingError } = await supabase
    .from("admin_users")
    .select("id, username")
    .eq("username", username)
    .maybeSingle();

  if (existingError) {
    console.error("Failed to check existing admin user", existingError);
    process.exit(1);
  }

  // 2. 生成密码哈希
  const passwordHash = await bcrypt.hash(password, 10);

  if (existing) {
    console.log(
      `User with username "${username}" already exists (id=${existing.id}), updating password and status.`
    );

    const { error: updateError } = await supabase
      .from("admin_users")
      .update({
        password_hash: passwordHash,
        role,
        is_active: true
      })
      .eq("id", existing.id);

    if (updateError) {
      console.error("Failed to update existing admin user", updateError);
      process.exit(1);
    }

    console.log("Existing admin user updated:", existing.id);
    process.exit(0);
  }

  // 3. 插入新管理员
  const { data, error } = await supabase
    .from("admin_users")
    .insert({
      username,
      password_hash: passwordHash,
      role,
      is_active: true
    })
    .select("id, username, role, created_at")
    .maybeSingle();

  if (error) {
    console.error("Failed to create initial admin user", error);
    process.exit(1);
  }

  console.log("Initial admin user created:", data);
  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
