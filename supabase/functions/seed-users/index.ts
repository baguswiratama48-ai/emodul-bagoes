import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const students = [
  // Kelas X.9
  { nis: "14213", nisn: "0099891698", name: "ALFINDRA" },
  { nis: "14229", nisn: "00107197713", name: "ANDINI GHEA SANTOSO" },
  { nis: "14230", nisn: "00106905944", name: "ANDYKA TEDY SETIAWAN" },
  { nis: "14256", nisn: "00107994048", name: "AULIA ZAZKIA" },
  { nis: "14269", nisn: "00106850680", name: "BUNGA LESTARI" },
  { nis: "14287", nisn: "003105633433", name: "DEWA SATRIA" },
  { nis: "14294", nisn: "00107191678", name: "DINI ANGGRAINI" },
  { nis: "14299", nisn: "00105118269", name: "DWITA NEISYA PUTRI" },
  { nis: "14308", nisn: "00106003100", name: "FADHIL HEPI ARKANA" },
  { nis: "14322", nisn: "00104189876", name: "FEBYOLA KURNIA AYU RAHMADHANI" },
  { nis: "14324", nisn: "00101253605", name: "FELICIA ASTANIA MELANI" },
  { nis: "14326", nisn: "00103543639", name: "FIANNA AZZAHRA" },
  { nis: "14330", nisn: "00105269488", name: "FIRZATULLAH NAUPAL HERLIAN" },
  { nis: "14354", nisn: "00103901157", name: "HENI NURWAHYUNI" },
  { nis: "14355", nisn: "00102174436", name: "HERLIAN VALENTINO DZAKI" },
  { nis: "14362", nisn: "00104194231", name: "INDRI AULU SETIASARI" },
  { nis: "14363", nisn: "0091768635", name: "INENZA FARADISTY" },
  { nis: "14407", nisn: "00102058806", name: "LUTFYA NENSHI ARENTA" },
  { nis: "14421", nisn: "00103936705", name: "MAHADHIKA AGFAR SEPTIAN" },
  { nis: "14428", nisn: "00103066844", name: "MAYVIA SEKAR AYUDIA" },
  { nis: "14430", nisn: "00101910570", name: "MEICHA ARYA PUTRI TWOVOMA" },
  { nis: "14441", nisn: "00101484621", name: "MUHAMMAD ALMER TSAQIF" },
  { nis: "14492", nisn: "0096678049", name: "QIRANI AZAHRA" },
  { nis: "14496", nisn: "00108601776", name: "RAFA HIDAYAT" },
  { nis: "14498", nisn: "00107128882", name: "RAFAEL KIANO ADITYA" },
  { nis: "14500", nisn: "00103603588", name: "RAFEYFA AS-SYLA JELITA" },
  { nis: "14503", nisn: "0093988492", name: "RAHMAD ALFATIH" },
  { nis: "14510", nisn: "00106853142", name: "RAYHAN KODJA ASSAFAH" },
  { nis: "14513", nisn: "0091158611", name: "REGINA DESWITA" },
  { nis: "14528", nisn: "00105284289", name: "RISMA AFRILLIA SAID" },
  { nis: "14544", nisn: "0095509455", name: "SHELA OKTAFERANI" },
  { nis: "14545", nisn: "0097362155", name: "SHIFA AYU SYALSABILA PH" },
  { nis: "14559", nisn: "00104950327", name: "SYIFFA ALZENA ZAHIRA" },
  { nis: "14565", nisn: "00106809090", name: "TIARA ADELLIA SAPUTRI" },
  { nis: "14583", nisn: "00109750304", name: "ZAHRA SEPTIANI" },
  // Kelas X.10
  { nis: "14228", nisn: "00109778641", name: "ANDIKA RASENDRYA RAMADHAN" },
  { nis: "14232", nisn: "00104499604", name: "ANGGUN RAMADANI" },
  { nis: "14241", nisn: "0091687272", name: "AQUINA IRSYADIVA HANIF" },
  { nis: "14251", nisn: "00109219651", name: "AUFA AZELIA MUSYAFA" },
  { nis: "14255", nisn: "00105112621", name: "AULIA ZALFA" },
  { nis: "14258", nisn: "00106712058", name: "AURA AULIA AZKALINA" },
  { nis: "14259", nisn: "0093760489", name: "AUREL NOVARIZA ANDITA" },
  { nis: "14286", nisn: "00105382155", name: "DESVITA AVERELIA KINANTI" },
  { nis: "14298", nisn: "00104860934", name: "DWI MAYA SARI" },
  { nis: "14316", nisn: "00109680562", name: "FAIZATUL FADILAH" },
  { nis: "14318", nisn: "0085971369", name: "FAREL" },
  { nis: "14335", nisn: "00106117324", name: "GALAXI RAZZAQ ANANTA" },
  { nis: "14337", nisn: "0095770150", name: "GALIH RAMADHAN" },
  { nis: "14351", nisn: "00101787765", name: "HANIFAH SYAKIRA" },
  { nis: "14370", nisn: "0092851162", name: "JOHANES CAHYO SOPHIANDI" },
  { nis: "14390", nisn: "00102808642", name: "KHANZA IMARA KUSUMA PUTRI" },
  { nis: "14397", nisn: "00102678335", name: "LETIA BILBINA BR SITEPU" },
  { nis: "14416", nisn: "00106861491", name: "M ZHAKI EGIAN GANTARI" },
  { nis: "14423", nisn: "00105859788", name: "MANDA ARISTIA" },
  { nis: "14424", nisn: "00102952507", name: "MARCELLIO WIDANA PUTRA" },
  { nis: "14451", nisn: "00102262683", name: "NABILA FEBYANA SARI" },
  { nis: "14458", nisn: "00105317670", name: "NADIYA AYU PRATIWI" },
  { nis: "14459", nisn: "0094584393", name: "NADYA KUSUMA" },
  { nis: "14474", nisn: "00107589945", name: "NIKEISYA ANINDYA PRAYITNO" },
  { nis: "14495", nisn: "00107272823", name: "RADITYA LUTFIO SANJAYA" },
  { nis: "14501", nisn: "00107818355", name: "RAFI FAITH ALVARO" },
  { nis: "14506", nisn: "00102912939", name: "RAISYA DEA RAMADHANI" },
  { nis: "14517", nisn: "00107577977", name: "RESTI SETIA ANZELLA" },
  { nis: "14535", nisn: "0093267950", name: "SALMA ABELYA ASTRIE" },
  { nis: "14538", nisn: "003106802486", name: "SARAH AULIAUL KHUSNA" },
  { nis: "14568", nisn: "0099318053", name: "VERNANDO TRI ANJAYA" },
  { nis: "14569", nisn: "00102004852", name: "VIONA MELDIANA RESTY" },
  { nis: "14575", nisn: "00105436000", name: "WILDA KHOIRUNNISA" },
  { nis: "14580", nisn: "0099124932", name: "YULIA WULAN DARI" },
  { nis: "14581", nisn: "00105620708", name: "YUSRIL REZA RAHMAT DANI" },
  { nis: "14597", nisn: "0113458277", name: "SANSAN DELBY IRANITA" },
  // Kelas X.11
  { nis: "14211", nisn: "00108570784", name: "AIRA AYU FINANDA" },
  { nis: "14223", nisn: "00104145663", name: "AMBAR APRILIANA" },
  { nis: "14233", nisn: "00107508712", name: "ANINDA AZIZATUN NISA" },
  { nis: "14236", nisn: "00102802131", name: "ANIS MAYLANI" },
  { nis: "14250", nisn: "0094155743", name: "ASYIFA TIARA BILQIS" },
  { nis: "14257", nisn: "0092660764", name: "AULYA ZAHHRA FITRIANTORO" },
  { nis: "14277", nisn: "00106285676", name: "CITRA SELVILYA" },
  { nis: "14289", nisn: "00104886963", name: "DIAH AYU ANINGSIH" },
  { nis: "14313", nisn: "0097497014", name: "FAHRIYADI" },
  { nis: "14334", nisn: "00106188162", name: "GABRIELA DILA PRILIROS" },
  { nis: "14342", nisn: "00104912677", name: "GERVASIUS GILANG NUGROHO" },
  { nis: "14346", nisn: "00102262429", name: "HAFIT EFENDI" },
  { nis: "14350", nisn: "00101701514", name: "HANIF RAMADHAN" },
  { nis: "14359", nisn: "00108145129", name: "ILUH CYLLVIA PUTRI RIKWAN" },
  { nis: "14361", nisn: "00104352177", name: "INDAH MONICA" },
  { nis: "14369", nisn: "0091635183", name: "JESSICHA LEANFITRI" },
  { nis: "14376", nisn: "00104345834", name: "KANAYA AMIRA GHAIDA ALFA" },
  { nis: "14379", nisn: "00103759499", name: "KAYLAH ALWINA KHAIRUNNISA" },
  { nis: "14381", nisn: "00103049282", name: "KESYA SALSABILLA" },
  { nis: "14401", nisn: "00109213898", name: "LIVIA RAMADHANI" },
  { nis: "14408", nisn: "00101254851", name: "LUTHFIA RIZKY RAMADHANI" },
  { nis: "14415", nisn: "00107109918", name: "M REGINALD PADABI" },
  { nis: "14419", nisn: "00103748004", name: "MADE KARTIKA" },
  { nis: "14438", nisn: "00106025380", name: "MUHAMAD ALDO ALDZIKRI" },
  { nis: "14461", nisn: "00104704664", name: "NAJWA SALWATUL AISY" },
  { nis: "14464", nisn: "0098932197", name: "NASYA PALOGA" },
  { nis: "14468", nisn: "0098649933", name: "NAYLA NARIN NATASHA" },
  { nis: "14493", nisn: "00103093930", name: "QUEENNISSA AZZYZY" },
  { nis: "14504", nisn: "0095474180", name: "RAHMAT PRAYOGO" },
  { nis: "14505", nisn: "00107235696", name: "RAHTU AQASHYA" },
  { nis: "14511", nisn: "00106438196", name: "RAYYAN DZAKI" },
  { nis: "14530", nisn: "0093567436", name: "RIZKI BIMA PRASETIA" },
  { nis: "14537", nisn: "00102060812", name: "SANDRA KASIH" },
  { nis: "14571", nisn: "00104525918", name: "VRITAS ARLEEAN YUSUF" },
  { nis: "14596", nisn: "0105540265", name: "KEVYN PRATAMA" },
];

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    
    const supabase = createClient(supabaseUrl, serviceRoleKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });

    const results: { success: string[]; failed: string[] } = {
      success: [],
      failed: [],
    };

    // Create teacher account
    const teacherEmail = "Bagoes87@guru.local";
    const teacherPassword = "11Maret2011";
    
    const { data: teacherData, error: teacherError } = await supabase.auth.admin.createUser({
      email: teacherEmail,
      password: teacherPassword,
      email_confirm: true,
      user_metadata: {
        full_name: "Bagoes",
        role: "guru",
      },
    });

    if (teacherError) {
      results.failed.push(`GURU (Bagoes87): ${teacherError.message}`);
    } else {
      results.success.push(`GURU: Bagoes87`);
    }

    // Create student accounts
    for (const student of students) {
      const email = `${student.nisn}@siswa.local`;
      const password = student.nis;

      const { data, error } = await supabase.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
        user_metadata: {
          full_name: student.name,
          role: "siswa",
        },
      });

      if (error) {
        results.failed.push(`${student.name} (${student.nisn}): ${error.message}`);
      } else {
        results.success.push(`${student.name}: NISN=${student.nisn}, NIS=${student.nis}`);
      }
    }

    return new Response(
      JSON.stringify({
        message: "Seeding completed",
        totalSuccess: results.success.length,
        totalFailed: results.failed.length,
        results,
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return new Response(
      JSON.stringify({ error: message }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
});
