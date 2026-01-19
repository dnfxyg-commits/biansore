
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL || 'https://dfneisysuhimexxtonby.supabase.co';
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRmbmVpc3lzdWhpbWV4eHRvbmJ5Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2ODY1NjAzMSwiZXhwIjoyMDg0MjMyMDMxfQ.3cgmArgRig8O8dm9Q0XcJ7h11-FzoJuFNFnTp5EyUkA';

const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

async function checkBlogs() {
  const { data, error } = await supabase.from('blog_posts').select('*');
  if (error) {
    console.error('Error fetching blogs:', error);
    return;
  }
  console.log('Total blog posts in DB:', data.length);
  data.forEach(post => {
    console.log(`- [${post.id}] ${post.title}`);
    console.log(`  Tags type: ${typeof post.tags}, Is Array: ${Array.isArray(post.tags)}`);
    console.log(`  Tags value:`, post.tags);
  });
}

checkBlogs();
