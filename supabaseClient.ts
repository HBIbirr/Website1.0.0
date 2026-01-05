import { createClient } from '@supabase/supabase-js'

// 🔴 换成你自己的
const supabaseUrl = 'https://elopmkcvsvcgtohawvhl.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVsb3Bta2N2c3ZjZ3RvaGF3dmhsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njc1ODI1MTYsImV4cCI6MjA4MzE1ODUxNn0.UitsBsm9TrT-e9RiSg1IXJB9a1KVjHL3zuPKsgmix9c'

export const supabase = createClient(supabaseUrl, supabaseKey)