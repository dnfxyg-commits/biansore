import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceRoleKey) {
  console.error("Missing env vars");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

async function initStorage() {
  const bucketName = 'uploads';
  console.log("Checking storage buckets...");
  const { data: buckets, error } = await supabase.storage.listBuckets();
  
  if (error) {
    console.error("Error listing buckets:", error);
    return;
  }

  const exists = buckets.find(b => b.name === bucketName);
  
  if (exists) {
    console.log(`Bucket '${bucketName}' already exists.`);
  } else {
    console.log(`Creating bucket '${bucketName}'...`);
    const { data, error: createError } = await supabase.storage.createBucket(bucketName, {
      public: true,
      fileSizeLimit: 10485760, // 10MB
      allowedMimeTypes: ['image/png', 'image/jpeg', 'image/gif', 'image/webp']
    });
    
    if (createError) {
      console.error("Error creating bucket:", createError);
    } else {
      console.log(`Bucket '${bucketName}' created successfully.`);
    }
  }
}

initStorage();
