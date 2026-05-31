import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://ohuysnrtmyqmmqojrtyi.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9odXlzbnJ0bXlxbW1xb2pydHlpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgyOTIxNjAsImV4cCI6MjA2Mzg2ODE2MH0.Z5wNMOGwkItbWr6KGX6e3WihhQlHiVtHx6em8Jjhr5Y'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
