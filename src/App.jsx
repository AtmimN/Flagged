import React, { createContext, useState, useContext, useEffect, useRef } from 'react';

// --- CONSTANTS ---
const GAME_PHASES = {
    MENU: 'MENU',
    WORKSPACE: 'WORKSPACE',
    EVALUATION: 'EVALUATION'
};

const POOL_TYPES = {
    TEXT: 'TEXT',
    IMAGE: 'IMAGE',
    LINK: 'LINK',
    FILE: 'FILE'
};

const POOLS = {
    A: [
        {
            id: 'A1', type: POOL_TYPES.TEXT, forwarder: 'Sari Lestari - Keuangan', sender: 'Customer Service <noreply@creamymango.id>', subject: 'Fwd: Laporan Bulanan Rekening Perusahaan',
            forwardNote: 'Ini laporan rekening bulanan dari Creamy Mango Bank. Beneran dari bank-nya kan? Mau aku terusin ke arsip keuangan.',
            content: 'Nasabah yang terhormat,\n\nBerikut kami sampaikan rekapitulasi transaksi bulanan rekening korporat perusahaan Anda untuk periode Maret 2024. Saldo akhir tercatat sebesar Rp 272.930.000 dengan total 24 transaksi yang telah diproses.\n\nDokumen ini digenerasi secara otomatis oleh sistem Creamy Mango Bank. Jika terdapat ketidaksesuaian pencatatan, silakan hubungi manajer akun Anda pada jam kerja.',
            isPhishing: false,
            aiReport: 'Gaya bahasa terdeteksi sangat formal dan statis (93% confidence). Kosakata selaras dengan sistem notifikasi perbankan otomatis. Tidak ditemukan pola manipulasi psikologis atau paksaan untuk membalas pesan.'
        },
        {
            id: 'A2', type: POOL_TYPES.TEXT, forwarder: 'Sari Lestari - Divisi Keuangan', sender: 'Finance Support <support@creamymango.co.id>', subject: 'Fwd: Pembaruan Keamanan Portal Payroll',
            forwardNote: 'Ini beneran dari bank minta data payroll sekarang? Agak panik takut gaji anak-anak telat cair nih. Tolong cek segera ya!',
            content: 'Kepada Manajer Keuangan,\n\nSebagai bagian dari komitmen kami terhadap keamanan data nasabah, Creamy Mango Bank telah merilis portal payroll versi terbaru yang dilengkapi enkripsi end-to-end.\n\nMohon balas email ini dengan melampirkan formulir data otorisasi rekening terbaru Anda untuk proses migrasi sistem. Migrasi ini kami harapkan selesai minggu ini agar jadwal pencairan dana perusahaan Anda tidak terganggu.\n\nHormat kami,\nTim Dukungan Keuangan',
            isPhishing: true,
            aiReport: 'Manipulasi linguistik tingkat tinggi (95% confidence). Teks sangat formal, sopan, dan tidak menggunakan ancaman eksplisit, sangat meniru komunikasi resmi bank, namun memiliki permintaan data otorisasi via balasan email yang melanggar protokol standar.'
        },
        {
            id: 'A3', type: POOL_TYPES.TEXT, forwarder: 'Sari Lestari - Divisi Keuangan', sender: 'Honeydew Billing <billing@honeydew.tech>', subject: 'Fwd: Tagihan Layanan Server Kuartal 3',
            forwardNote: 'Tagihan server dari Honeydew udah masuk nih. Aman kan ya buat aku proses pembayarannya?',
            content: 'Halo Tim Keuangan,\n\nSemoga hari kalian menyenangkan! Kami ingin menginfokan bahwa tagihan layanan server Honeydew Inc. untuk periode kuartal 3 sudah bisa diproses. Total tagihan periode ini sebesar Rp 18.476.000 mencakup biaya sewa server, penggunaan bandwidth, dan penyimpanan tambahan sesuai laporan bulan lalu.\n\nPembayarannya bisa melalui rekening vendor kami seperti biasa ya, paling lambat akhir bulan ini. Thank you!',
            isPhishing: false,
            aiReport: 'Karakteristik linguistik terdeteksi kasual dan ramah (86% confidence). Gaya bahasa ini sangat sesuai dengan data profil komunikasi vendor Honeydew Inc. Tidak ada tenggat waktu yang tidak masuk akal atau upaya memotong prosedur resmi.'
        },
        {
            id: 'A4', type: POOL_TYPES.TEXT, forwarder: 'Sari Lestari - Divisi Keuangan', sender: 'Honeydew Admin <admin-update@honeydew.tech.com>', subject: 'Fwd: Re-sinkronisasi Akun Vendor',
            forwardNote: 'Sekarang tim Honeydew minta password portal via email kah? Tolong dicek kak, makasih.',
            content: 'Halo kak Sari,\n\nSorry banget ganggu waktunya. Tim kita lagi ada maintenance darurat untuk re-sinkronisasi database kemitraan. Biar akses portal perusahaan kakak gak kerestart besok pagi, tolong reply email ini pakai username dan password sementara yang biasa dipakai ya.\n\nThanks banget atas bantuannya!',
            isPhishing: true,
            aiReport: 'Terdeteksi spear-phishing yang sangat adaptif (92% confidence). Penyerang berhasil meniru budaya komunikasi "santai" Honeydew Inc. secara sempurna untuk menurunkan kewaspadaan target. Permintaan kredensial disamarkan sebagai bantuan teknis ringan antar rekan kerja.'
        }
    ],
    B: [
        {
            id: 'B1', type: POOL_TYPES.IMAGE, forwarder: 'Andika Raymond - Divisi Pemasaran', sender: 'Avocado Store <noreply@avocado-ent.com>', subject: 'Fwd: Receipt: Lisensi Desain',
            forwardNote: 'Invoice aset visual bulan ini udah masuk. Aman kan filenya buat gw download?',
            content: 'Pembayaran lisensi aset visual perusahaan Anda telah berhasil. Silakan simpan gambar invoice di bawah ini untuk keperluan laporan pajak Anda.',
            imageMetadata: { fileName: 'invoice_avo_assets.png', dimensions: '1080x1080', pixelAnomaly: '0.1%', hiddenLayer: 'None detected' },
            isPhishing: false,
            aiReport: 'Struktur bahasa pengantar sangat netral dan transaksional (94% confidence). Tidak ada instruksi spesifik untuk mengeksekusi file, hanya arahan administratif standar untuk penyimpanan data.'
        },
        {
            id: 'B2', type: POOL_TYPES.IMAGE, forwarder: 'Andika Raymond - Divisi Pemasaran', sender: 'Avocado Support <refund@avocado-ent.com>', subject: 'Fwd: Bukti Transfer Refund',
            forwardNote: 'Gw disuruh scan QR code buat refund nih. File gambarnya aman ga ya? Boleh bantu cek?',
            content: 'Sesuai dengan permintaan Anda, proses pengembalian dana telah kami setujui. Bukti transfer resmi telah kami lampirkan pada dokumen gambar di bawah ini. Silakan pindai QR Code di dalamnya untuk validasi pencairan ke rekening Anda.',
            imageMetadata: { fileName: 'refund_receipt_QR.png', dimensions: '600x800', pixelAnomaly: '2.4%', hiddenLayer: 'Suspicious URL embedded in QR data' },
            isPhishing: true,
            aiReport: 'Gaya bahasa terdeteksi profesional dan meyakinkan (88% confidence). Tidak ada kepanikan yang direkayasa.'
        },
        {
            id: 'B3', type: POOL_TYPES.IMAGE, forwarder: 'Andika Raymond - Divisi Pemasaran', sender: 'Spicy Lemon Sales <sales@spicylemon.com>', subject: 'Fwd: Penawaran Fitur AI Terbaru',
            forwardNote: 'Vendor Spicy Lemon nawarin fitur AI baru nih. Coba dicek dulu deh infografisnya ada virusnya nggak sebelum gw share ke tim.',
            content: 'Kepada Tim Pemasaran,\n\nBersama surat elektronik ini, kami dari Spicy Lemon Co., Ltd. melampirkan dokumen visual mengenai modul analitik pemasaran terbaru. Silakan ditinjau sebagai bahan pertimbangan optimalisasi strategi digital perusahaan Anda.',
            imageMetadata: { fileName: 'spicylemon_infographic.jpg', dimensions: '1920x1080', pixelAnomaly: '1.2%', hiddenLayer: 'None detected' },
            isPhishing: false,
            aiReport: 'Probabilitas kosakata selaras dengan komunikasi pemasaran korporat yang resmi dan formal (92% confidence). Teks bersifat menawarkan secara profesional tanpa adanya teknik manipulasi urgensi waktu.'
        },
        {
            id: 'B4', type: POOL_TYPES.IMAGE, forwarder: 'Andika Raymond - Divisi Pemasaran', sender: 'Spicy Lemon IT <update@splcylemon.com>', subject: 'Fwd: Pembaruan Modul Pemasaran',
            forwardNote: 'Ini beneran gw harus update lewat scan barcode? Buruan dicek dong, lagi banyak deadline nih!',
            content: 'Pemberitahuan,\n\nKami telah merilis patch stabilitas untuk modul perangkat lunak Spicy Lemon Anda. Silakan unduh gambar barcode instalasi terlampir untuk menginisialisasi pembaruan secara otomatis di latar belakang.',
            imageMetadata: { fileName: 'patch_init.png', dimensions: '500x500', pixelAnomaly: '1.8%', hiddenLayer: 'Obfuscated PowerShell script' },
            isPhishing: true,
            aiReport: 'Teks menggunakan jargon teknis yang sangat rapi untuk menciptakan ilusi otoritas TI (89% confidence).'
        }
    ],
    C: [
        {
            id: 'C1', type: POOL_TYPES.LINK, forwarder: 'Laila Firza - Divisi Pengadaan', sender: 'Creamy Mango Bank <alert@creamymango.id>', subject: 'Fwd: e-Statement Tersedia',
            forwardNote: 'Hai kakk, e-statement bulanan kita udah keluar. Harusnya sih aman ya link resminya? Tolong dicek dong hehe.',
            content: 'Laporan elektronik rekening korporat untuk bulan ini sudah tersedia di portal internet banking. Silakan akses melalui tautan resmi kami di bawah ini.',
            link: '[https://creamymango.id/ebanking/login]', sandboxData: { redirectChain: 'Direct (1 hop)', sslValid: true, domainAge: '10 years', formFields: 'None' },
            isPhishing: false,
            aiReport: 'Karakteristik teks sangat stabil dan informatif (92% confidence). Tidak ditemukan upaya manipulasi urgensi atau ancaman penutupan akun.'
        },
        {
            id: 'C2', type: POOL_TYPES.LINK, forwarder: 'Laila Firza - Divisi Pengadaan', sender: 'Creamy Mango Security <alert@creamymango.id.secure-portal.net>', subject: 'Fwd: Tinjauan Aktivitas Rekening',
            forwardNote: 'Kakk, tolong banget ini darurat! Katanya ada aktivitas aneh di rekening, aku harus klik linknya sekarang gak??',
            content: 'Kami mendeteksi adanya aktivitas login dari lokasi yang tidak dikenal pada rekening vendor perusahaan Anda. Sebagai langkah pencegahan, kami telah membatasi sementara akses keluar. Silakan tinjau aktivitas ini melalui portal keamanan kami.',
            link: '[https://creamymango.id/secure/review]', sandboxData: { redirectChain: 'Direct (1 hop)', sslValid: true, domainAge: '2 days', formFields: 'Corporate ID, Password, OTP' },
            isPhishing: true,
            aiReport: 'Manipulasi psikologis dilakukan dengan sangat tenang dan terstruktur (94% confidence).'
        },
        {
            id: 'C3', type: POOL_TYPES.LINK, forwarder: 'Laila Firza - Divisi Pengadaan', sender: 'Banana Milk Procurement <procurement@bananamilk.co.id>', subject: 'Fwd: Update Portal Pengadaan',
            forwardNote: 'Kakk, ini beneran dari vendor Banana Milk ngasih link server baru buat katalog? Tolong dicek yaa biar aku bisa akses dengan tenang.',
            content: 'Diberitahukan kepada seluruh mitra, PT Banana Milk Industry telah memindahkan seluruh dokumen pengadaan ke server baru. Tautan berikut adalah akses resmi katalog bulan ini.',
            link: '[https://bananamilk.co.id/portal/vendor-catalog]', sandboxData: { redirectChain: 'Direct (1 hop)', sslValid: true, domainAge: '5 years', formFields: 'None' },
            isPhishing: false,
            aiReport: 'Gaya penulisan sesuai dengan prosedur pengumuman korporat (88% confidence). Tujuan tautan dijelaskan secara transparan tanpa ada kewajiban login darurat.'
        },
        {
            id: 'C4', type: POOL_TYPES.LINK, forwarder: 'Laila Firza - Pengadaan', sender: 'Banana Milk Legal <legal@bananamiIk.co.id>', subject: 'Fwd: Dokumen Kesepakatan Distribusi (Revisi)',
            forwardNote: 'Aku dapet email suruh cek draf hukum dari Banana Milk nih. Linknya aman buat dibuka gak? Tolong cepat ya!',
            content: 'Terlampir adalah revisi terbaru dari dokumen kesepakatan distribusi pengadaan barang. Silakan akses tautan cloud aman di bawah ini untuk mengunduh dan meninjau draf tersebut sebelum rapat bulan depan.',
            link: '[http://bananamilk.co.id/legal-docs/draft-rev3]', sandboxData: { redirectChain: '2 hops', sslValid: false, domainAge: '1 week', formFields: 'Microsoft O365 Login' },
            isPhishing: true,
            aiReport: 'Gaya bahasa sangat meyakinkan (96% confidence). Teks sama sekali tidak menggunakan ancaman waktu, melainkan memanfaatkan rutinitas bisnis normal (peninjauan draf kesepakatan).'
        }
    ],
    D: [
        {
            id: 'D1', type: POOL_TYPES.LINK, forwarder: 'Reina Angelica - Divisi Riset dan Pengembangan', sender: 'Bitter Melon, LLC <beta@bittermelon.io>', subject: 'Fwd: Akses Beta Terbatas - Engine V5',
            forwardNote: 'Vendor game engine kita ngasih link buat nyoba versi beta terbaru. Tolong cek linknya ya, soalnya aku masih ragu-ragu.',
            content: 'Halo Tim Riset, kami telah merilis Beta Engine V5. Anda bisa mengunduh dan mencoba fitur terbarunya melalui portal khusus partner kami.\n\n Terima kasih atas kerja samanya dan selamat mencoba!',
            link: '[https://bittermelon.io/partner-beta-v5]',
            sandboxData: { redirectChain: 'Direct (1 hop)', sslValid: true, domainAge: '4 years', formFields: 'None' },
            isPhishing: false,
            aiReport: 'Probabilitas gaya bahasa selaras dengan pengumuman pembaruan produk standar (89% confidence). Kalimat bersifat ajakan informatif tanpa adanya elemen paksaan atau batasan waktu yang mendesak.'
        },
        {
            id: 'D2', type: POOL_TYPES.LINK, forwarder: 'Reina Angelica - Divisi Riset dan Pengembangan', sender: 'Bitter Melon, LLC <security@bittermelons.io>', subject: 'Fwd: URGENT: Akun Developer Ditangguhkan',
            forwardNote: 'Kak tolong ini gak bener kan? Kemarin aku sempat lalai, tapi aku nggak nyangka akunku sampai ditangguhkan T_T',
            content: '[Peringatan Keamanan]\n\nAkun developer Anda telah ditangguhkan karena adanya aktivitas mencurigakan. Segera konfirmasi dan verifikasi identitas Anda untuk mencegah penangguhan permanen!',
            link: '[https://bittermelons.io/auth/verify]',
            sandboxData: { redirectChain: '3 hops', sslValid: true, domainAge: '2 days', formFields: 'Email, Password, 2FA Code' },
            isPhishing: true,
            aiReport: 'Terdeteksi manipulasi psikologis tingkat tinggi (96% confidence). Teks sangat bergantung pada penciptaan rasa panik dan urgensi untuk memaksa target bertindak ceroboh.'
        },
        {
            id: 'D3', type: POOL_TYPES.IMAGE, forwarder: 'Reina Angelica - Divisi Riset dan Pengembangan', sender: 'Bitter Melon, LLC <art-team@bittermelon.io>', subject: 'Fwd: Konsep Art Karakter Baru',
            forwardNote: 'Ini beneran referensi aset visual dari tim Bitter Melon? Gambarnya aman kan kak?',
            content: 'Terlampir adalah beberapa konsep seni karakter untuk proyek kuartal depan. Mohon ditinjau dan kami menunggu feedback Anda. \n\n Hormat Kami, Tim Bitter Melon',
            imageMetadata: { fileName: 'concept_art_v2.png', dimensions: '2048x2048', pixelAnomaly: '0.05%', hiddenLayer: 'None detected' },
            isPhishing: false,
            aiReport: 'Gaya bahasa terdeteksi sangat netral dan transaksional (91% confidence). Teks berupa kalimat pengantar pasif yang umum digunakan dalam komunikasi pertukaran aset desain antar divisi.'
        },
        {
            id: 'D4', type: POOL_TYPES.IMAGE, forwarder: 'Reina Angelica - Divisi Riset dan Pengembangan', sender: 'Bitter Melon, LLC <collab@bittermelon.io>', subject: 'Fwd: Revisi Aset UI',
            forwardNote: 'Mereka ngirim revisi UI, tapi kali ini revisiannya cepat banget, nggak seperti biasanya. Tolong dicek ya.',
            content: 'Berikut adalah revisi antarmuka sesuai permintaan. Silakan buka gambar terlampir untuk melihat detail resolusi tinggi.',
            imageMetadata: { fileName: 'ui_revised_final.png', dimensions: '3840x2160', pixelAnomaly: 'Tinggi (Manipulasi LSB Terdeteksi)', hiddenLayer: 'Terdapat injeksi skrip eksekusi (Payload)' },
            isPhishing: true,
            aiReport: 'Karakteristik linguistik tampak normal dan meniru prosedur revisi desain secara sempurna (85% confidence). Tidak ditemukan pola ancaman pada teks'
        }
    ],
    E: [
        {
            id: 'E1', type: POOL_TYPES.FILE, forwarder: 'Tony Hartono - Divisi Hukum', sender: 'Starfruit Law Office <legal@starfruitlaw.co.id>', subject: 'Fwd: Draft Kontrak Kerja Sama',
            forwardNote: 'Tolong periksa ini. Apakah benar ini surat dari Starfruit Law?',
            content: 'Terlampir draft kontrak kerja sama terbaru. Dokumen ini dilindungi dengan enkripsi tingkat lanjut untuk menjaga kerahasiaan klien.',
            file: 'Draft_Kontrak_Rahasia.pdf',
            isPhishing: false,
            aiReport: 'Teks menggunakan kosakata legal yang sangat formal dan terstruktur rapi (92% confidence). Penjelasan mengenai enkripsi di dalam kalimat pengantar merupakan hal yang lumrah dalam prosedur pengiriman dokumen kontrak yang sensitif.'
        },
        {
            id: 'E2', type: POOL_TYPES.FILE, forwarder: 'Tony Hartono - Divisi Hukum', sender: 'Starfruit Law Office <billing-urgent@starfruitIaw.co.id>', subject: 'Fwd: PENGINGAT TERAKHIR: Somasi & Tagihan',
            forwardNote: 'Tolong segera dicek ini benar atau tidak, karena akan saya tindak lanjuti.',
            content: '[PEMBERITAHUAN HUKUM]\n\nPerusahaan Anda gagal melunasi biaya konsultasi bulan lalu. Jika pembayaran tidak dilakukan dalam 24 jam, kami akan menempuh jalur hukum. Rincian somasi terlampir.',
            file: 'SOMASI_HUKUM_URGENT.pdf',
            isPhishing: true,
            aiReport: 'Terdeteksi upaya rekayasa sosial yang sangat agresif (98% confidence). Teks secara eksplisit menggunakan ancaman dan tenggat waktu yang tidak rasional untuk memicu kepanikan dan mengabaikan protokol verifikasi.'
        },
        {
            id: 'E3', type: POOL_TYPES.FILE, forwarder: 'Tony Hartono - Divisi Hukum', sender: 'Starfruit Law Office <legal@starfruitlaw.co.id>', subject: 'Fwd: Revisi NDA Karyawan',
            forwardNote: 'Ini hasi revisi NDA dari Starfruit Law. Mohon dicek sebelum saya teruskan ke HR.',
            content: 'Sesuai diskusi kemarin, kami telah merevisi klausul Non-Disclosure Agreement. Silakan tinjau dokumen terlampir.',
            file: 'Revisi_NDA_2026.pdf',
            isPhishing: false,
            aiReport: 'Probabilitas gaya bahasa sesuai dengan tindak lanjut komunikasi rutin (90% confidence). Referensi kalimat ke "diskusi kemarin" menunjukkan adanya konteks komunikasi yang berkelanjutan tanpa unsur manipulatif.'
        },
        {
            id: 'E4', type: POOL_TYPES.FILE, forwarder: 'Tony Hartono - Divisi Hukum', sender: 'Starfruit Law Office <admin@starfruitIaw.co.id>', subject: 'Fwd: Perubahan Rekening Pembayaran',
            forwardNote: 'Apa benar firma hukum kita ganti nomor rekening pembayaran? Mohon dicek surat edaran resminya.',
            content: 'Pemberitahuan penting. Mulai bulan ini, seluruh pembayaran biaya legal harap ditransfer ke rekening operasional kami yang baru seperti yang tertera pada dokumen terlampir.',
            file: 'Surat_Edaran_Rekening.pdf',
            isPhishing: true,
            aiReport: 'Terdeteksi pola "Business Email Compromise" atau Kompromi Email Bisnis (88% confidence). Teks menginstruksikan perubahan prosedur finansial (pergantian rekening) secara sepihak dan tiba-tiba, yang merupakan taktik umum dalam penipuan korporat.'
        }
    ]
};

const COMPANY_DB = [
    {
        id: 'creamy_mango',
        name: 'Creamy Mango Bank',
        keywords: ['creamy', 'mango', 'bank', 'keuangan', 'cmb'],
        icon: 'fa-building-columns',
        iconColor: 'text-yellow-500'
    },
    {
        id: 'banana_milk',
        name: 'PT Banana Milk Industry',
        keywords: ['banana', 'milk', 'pisang', 'susu', 'industri', 'pt', 'pabrik', 'manufaktur'],
        icon: 'fa-industry',
        iconColor: 'text-yellow-400'
    },
    {
        id: 'spicy_lemon',
        name: 'Spicy Lemon Co., Ltd.',
        keywords: ['spicy', 'lemon', 'ai', 'analitik', 'marketing', 'vendor'],
        icon: 'fa-fire',
        iconColor: 'text-red-500'
    },
    {
        id: 'honeydew',
        name: 'Honeydew Inc.',
        keywords: ['honeydew', 'cloud', 'server', 'hosting', 'tech'],
        icon: 'fa-server',
        iconColor: 'text-green-500'
    },
    {
        id: 'avocado_store',
        name: 'Avocado Store',
        keywords: ['avocado', 'store', 'desain', 'aset', 'visual', 'ent', 'entertainment'],
        icon: 'fa-palette',
        iconColor: 'text-green-600'
    },
    {
        id: 'bitter_melon',
        name: 'Bitter Melon, LLC',
        keywords: ['bitter', 'melon', 'game', 'engine', 'studio', 'developer'],
        icon: 'fa-gamepad',
        iconColor: 'text-green-500'
    },
    {
        id: 'starfruit_law',
        name: 'Starfruit Law Office',
        keywords: ['starfruit', 'law', 'hukum', 'firma', 'pengacara', 'legal'],
        icon: 'fa-star',
        iconColor: 'text-yellow-600'
    }
];

// --- GAME CONTEXT ---
const GameContext = createContext();
const useGame = () => useContext(GameContext);

const GameProvider = ({ children }) => {
    const [currentPhase, setCurrentPhase] = useState(GAME_PHASES.MENU);
    const [documents, setDocuments] = useState([]);
    const [currentDocIndex, setCurrentDocIndex] = useState(0);
    const [aiUsesLeft, setAiUsesLeft] = useState(1);
    const [playerResults, setPlayerResults] = useState([]);

    const getRandomItem = (pool) => pool[Math.floor(Math.random() * pool.length)];

    const startGame = () => {
        const docA = getRandomItem(POOLS.A);
        const docB = getRandomItem(POOLS.B);
        const docC = getRandomItem(POOLS.C);
        const docD = getRandomItem(POOLS.D);
        const docE = getRandomItem(POOLS.E);

        setDocuments([docA, docB, docC, docD, docE]);
        setCurrentDocIndex(0);
        setAiUsesLeft(2);
        setPlayerResults([]);
        setCurrentPhase(GAME_PHASES.WORKSPACE);
    };

    const makeDecision = (decision) => {
        const currentDoc = documents[currentDocIndex];
        const isPhishingActual = currentDoc.isPhishing;
        const playerSaidPhishing = decision === 'Phishing';
        const isCorrect = isPhishingActual === playerSaidPhishing;

        const resultObj = {
            document: currentDoc,
            decision,
            isCorrect,
            isFalsePositive: !isPhishingActual && playerSaidPhishing,
            isFalseNegative: isPhishingActual && !playerSaidPhishing
        };

        setPlayerResults(prev => [...prev, resultObj]);

        if (currentDocIndex < 4) {
            setCurrentDocIndex(prev => prev + 1);
        } else {
            setCurrentPhase(GAME_PHASES.EVALUATION);
        }
    };

    const useAi = () => {
        if (aiUsesLeft > 0) {
            setAiUsesLeft(prev => prev - 1);
            return true;
        }
        return false;
    };

    const resetGame = () => setCurrentPhase(GAME_PHASES.MENU);

    return (
        <GameContext.Provider value={{ currentPhase, documents, currentDocIndex, aiUsesLeft, playerResults, startGame, makeDecision, useAi, resetGame }}>
            {children}
        </GameContext.Provider>
    );
};

// --- COMPONENTS ---

// Minigames
const MemoryMatch = ({ onRoundComplete, round }) => {
    const [cards, setCards] = useState([]);
    const [flippedIndices, setFlippedIndices] = useState([]);
    const [matchedPairs, setMatchedPairs] = useState([]);
    const [isChecking, setIsChecking] = useState(false);

    const colors = ['#EF4444', '#142d9eff', '#10B981', '#F59E0B', '#8B5CF6', '#EC4899', '#14B8A6', '#F97316'];

    useEffect(() => {
        const pairsCount = round === 1 ? 4 : 6;
        const currentColors = colors.slice(0, pairsCount);
        const newCards = [...currentColors, ...currentColors]
            .sort(() => Math.random() - 0.5)
            .map((color, idx) => ({ id: idx, color }));
        setCards(newCards);
        setFlippedIndices([]);
        setMatchedPairs([]);
        setIsChecking(false);
    }, [round]);

    const handleCardClick = (index) => {
        if (isChecking || flippedIndices.includes(index) || matchedPairs.includes(cards[index].color)) return;

        const newFlipped = [...flippedIndices, index];
        setFlippedIndices(newFlipped);

        if (newFlipped.length === 2) {
            setIsChecking(true);
            const [firstIdx, secondIdx] = newFlipped;
            if (cards[firstIdx].color === cards[secondIdx].color) {
                const newMatched = [...matchedPairs, cards[firstIdx].color];
                setMatchedPairs(newMatched);
                setFlippedIndices([]);
                setIsChecking(false);
                if (newMatched.length === (round === 1 ? 4 : 6)) {
                    setTimeout(onRoundComplete, 500);
                }
            } else {
                setTimeout(() => {
                    setFlippedIndices([]);
                    setIsChecking(false);
                }, 500);
            }
        }
    };

    return (
        <div className="grid grid-cols-4 gap-3 p-4 bg-office-900/50 rounded-xl border border-office-700/50 mx-auto mt-4 max-w-[400px]">
            {cards.map((card, idx) => {
                const isFlipped = flippedIndices.includes(idx) || matchedPairs.includes(card.color);
                return (
                    <div
                        key={idx}
                        onClick={() => handleCardClick(idx)}
                        className={`w-14 h-14 sm:w-16 sm:h-16 rounded-lg transition-all duration-300 shadow-md flex items-center justify-center ${isFlipped ? 'cursor-default' : 'cursor-pointer bg-office-700 hover:bg-office-600 border border-office-500/30'}`}
                        style={{
                            backgroundColor: isFlipped ? card.color : undefined
                        }}
                    ></div>
                );
            })}
        </div>
    );
};

const LEVEL_TEMPLATES = {
    1: [ // Round 1
        [
            [1, 0, 0, 1],
            [2, 3, 2, 0],
            [0, 0, 3, 0],
            [0, 0, 0, 0]
        ],
        [
            [1, 2, 0, 2],
            [0, 3, 0, 0],
            [0, 3, 0, 0],
            [0, 0, 0, 1]
        ],
        [
            [0, 0, 0, 1],
            [0, 2, 3, 2],
            [0, 0, 3, 0],
            [1, 0, 0, 0]
        ]
    ],
    2: [ // Round 2
        [
            [1, 0, 0, 0, 1],
            [2, 3, 0, 3, 2],
            [0, 4, 5, 0, 0],
            [0, 0, 4, 5, 0],
            [0, 0, 0, 0, 0]
        ],
        [
            [2, 0, 0, 3, 1],
            [0, 0, 5, 4, 0],
            [0, 3, 5, 0, 0],
            [0, 4, 0, 0, 0],
            [0, 0, 2, 1, 0]
        ],
        [
            [1, 3, 0, 0, 2],
            [0, 3, 0, 0, 0],
            [0, 0, 1, 2, 0],
            [4, 5, 0, 0, 0],
            [0, 0, 0, 4, 5]
        ]
    ]
};

const DOT_COLORS = {
    1: '#EF4444', // Merah
    2: '#3B82F6', // Biru
    3: '#10B981', // Hijau
    4: '#F59E0B', // Kuning
    5: '#8B5CF6'  // Ungu
};

const ConnectPipes = ({ onRoundComplete, round }) => {
    const canvasRef = useRef(null);
    const [gridSize, setGridSize] = useState(4);
    const [dots, setDots] = useState([]);
    const [paths, setPaths] = useState({}); // { colorId: [{row, col}, ...] }
    const [activeColor, setActiveColor] = useState(null);
    const [pairsCount, setPairsCount] = useState(0);

    useEffect(() => {
        const templates = LEVEL_TEMPLATES[round];
        const template = templates[Math.floor(Math.random() * templates.length)];
        const size = template.length;
        setGridSize(size);

        const newDots = [];
        let maxColor = 0;
        for (let r = 0; r < size; r++) {
            for (let c = 0; c < size; c++) {
                const val = template[r][c];
                if (val > 0) {
                    newDots.push({ row: r, col: c, colorId: val, color: DOT_COLORS[val], id: `${val}-${r}-${c}` });
                    if (val > maxColor) maxColor = val;
                }
            }
        }
        setPairsCount(maxColor);
        setDots(newDots);
        setPaths({});
        setActiveColor(null);
    }, [round]);

    const draw = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        const width = canvas.width;
        const height = canvas.height;
        const cellSize = width / gridSize;

        ctx.fillStyle = '#082f49';
        ctx.fillRect(0, 0, width, height);

        // Draw grid lines
        ctx.strokeStyle = 'rgba(56, 189, 248, 0.15)';
        ctx.lineWidth = 1;
        for (let i = 0; i <= gridSize; i++) {
            ctx.beginPath();
            ctx.moveTo(i * cellSize, 0);
            ctx.lineTo(i * cellSize, height);
            ctx.stroke();
            ctx.beginPath();
            ctx.moveTo(0, i * cellSize);
            ctx.lineTo(width, i * cellSize);
            ctx.stroke();
        }

        // Draw paths
        ctx.lineWidth = 12;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';

        Object.keys(paths).forEach(colorId => {
            const path = paths[colorId];
            if (!path || path.length === 0) return;

            ctx.shadowBlur = 10;
            ctx.shadowColor = DOT_COLORS[colorId];
            ctx.strokeStyle = DOT_COLORS[colorId];
            ctx.beginPath();

            path.forEach((cell, index) => {
                const cx = cell.col * cellSize + cellSize / 2;
                const cy = cell.row * cellSize + cellSize / 2;
                if (index === 0) {
                    ctx.moveTo(cx, cy);
                } else {
                    ctx.lineTo(cx, cy);
                }
            });
            ctx.stroke();
            ctx.shadowBlur = 0;
        });

        // Draw dots
        dots.forEach(dot => {
            ctx.shadowBlur = 10;
            ctx.shadowColor = dot.color;
            ctx.fillStyle = dot.color;
            ctx.beginPath();
            ctx.arc(dot.col * cellSize + cellSize / 2, dot.row * cellSize + cellSize / 2, cellSize * 0.3, 0, Math.PI * 2);
            ctx.fill();
            ctx.shadowBlur = 0;
        });
    };

    useEffect(() => {
        draw();
    }, [dots, paths, gridSize]);

    const getCellFromEvent = (evt) => {
        const canvas = canvasRef.current;
        const rect = canvas.getBoundingClientRect();
        const x = (evt.clientX - rect.left) * (canvas.width / rect.width);
        const y = (evt.clientY - rect.top) * (canvas.height / rect.height);
        const cellSize = canvas.width / gridSize;
        const col = Math.floor(x / cellSize);
        const row = Math.floor(y / cellSize);

        if (row >= 0 && row < gridSize && col >= 0 && col < gridSize) {
            return { row, col };
        }
        return null;
    };

    const getDotAtCell = (row, col) => {
        return dots.find(d => d.row === row && d.col === col);
    };

    const getColorAtCell = (row, col) => {
        for (const colorId of Object.keys(paths)) {
            const path = paths[colorId];
            const idx = path.findIndex(p => p.row === row && p.col === col);
            if (idx !== -1) return { colorId, idx };
        }
        return null;
    };

    const handleMouseDown = (e) => {
        const cell = getCellFromEvent(e);
        if (!cell) return;

        const dot = getDotAtCell(cell.row, cell.col);
        const pathData = getColorAtCell(cell.row, cell.col);

        if (dot) {
            setActiveColor(dot.colorId);
            setPaths(prev => ({ ...prev, [dot.colorId]: [cell] }));
        } else if (pathData) {
            setActiveColor(pathData.colorId);
            setPaths(prev => {
                const currentPath = prev[pathData.colorId];
                return { ...prev, [pathData.colorId]: currentPath.slice(0, pathData.idx + 1) };
            });
        }
    };

    const handleMouseMove = (e) => {
        if (!activeColor) return;
        const cell = getCellFromEvent(e);
        if (!cell) return;

        setPaths(prev => {
            const currentPath = prev[activeColor] || [];
            if (currentPath.length === 0) return prev;

            const lastCell = currentPath[currentPath.length - 1];

            if (lastCell.row === cell.row && lastCell.col === cell.col) return prev;

            const rowDiff = Math.abs(lastCell.row - cell.row);
            const colDiff = Math.abs(lastCell.col - cell.col);
            if (rowDiff + colDiff !== 1) return prev;

            const dotAtNewCell = getDotAtCell(cell.row, cell.col);
            const pathAtNewCell = getColorAtCell(cell.row, cell.col);

            if (pathAtNewCell && pathAtNewCell.colorId === activeColor.toString()) {
                return { ...prev, [activeColor]: currentPath.slice(0, pathAtNewCell.idx + 1) };
            }

            if ((pathAtNewCell && pathAtNewCell.colorId !== activeColor.toString()) ||
                (dotAtNewCell && dotAtNewCell.colorId !== activeColor)) {
                return prev;
            }

            const newPath = [...currentPath, cell];

            if (dotAtNewCell && dotAtNewCell.colorId === activeColor) {
                setTimeout(() => setActiveColor(null), 0);
                return { ...prev, [activeColor]: newPath };
            }

            return { ...prev, [activeColor]: newPath };
        });

        const dotAtNewCell = getDotAtCell(cell.row, cell.col);
        const pathAtNewCell = getColorAtCell(cell.row, cell.col);
        if ((pathAtNewCell && pathAtNewCell.colorId !== activeColor.toString()) ||
            (dotAtNewCell && dotAtNewCell.colorId !== activeColor)) {
            setActiveColor(null);
        }
    };

    const handleMouseUp = () => {
        setActiveColor(null);
    };

    useEffect(() => {
        if (activeColor !== null) return;
        if (pairsCount === 0 || dots.length === 0) return;

        let totalFilledCells = 0;
        let allConnected = true;

        for (let i = 1; i <= pairsCount; i++) {
            const path = paths[i];
            if (!path || path.length === 0) {
                allConnected = false;
                break;
            }

            const startCell = path[0];
            const endCell = path[path.length - 1];

            const startDot = getDotAtCell(startCell.row, startCell.col);
            const endDot = getDotAtCell(endCell.row, endCell.col);

            if (!startDot || startDot.colorId !== i || !endDot || endDot.colorId !== i || startCell === endCell) {
                allConnected = false;
                break;
            }
            totalFilledCells += path.length;
        }

        if (allConnected && totalFilledCells === gridSize * gridSize) {
            setTimeout(onRoundComplete, 500);
        }
    }, [paths, activeColor, pairsCount, gridSize]);

    return (
        <div style={{ textAlign: 'center', display: 'flex', justifyContent: 'center' }}>
            <canvas
                ref={canvasRef}
                width={340}
                height={340}
                style={{ border: '1px solid rgba(56, 189, 248, 0.3)', borderRadius: '8px', touchAction: 'none', maxWidth: '100%', height: 'auto' }}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
                onTouchStart={(e) => handleMouseDown(e.touches[0])}
                onTouchMove={(e) => handleMouseMove(e.touches[0])}
                onTouchEnd={(e) => handleMouseUp()}
            />
        </div>
    );
};

const MinigameModal = ({ onSuccess, onFail, onClose }) => {
    const [timeLeft, setTimeLeft] = useState(120);
    const [round, setRound] = useState(1);
    const [gameType, setGameType] = useState(null);
    const [failed, setFailed] = useState(false);

    useEffect(() => {
        setGameType(Math.random() > 0.5 ? 'MEMORY' : 'PIPES');
    }, []);

    useEffect(() => {
        if (failed || round > 2) return;
        const timer = setInterval(() => {
            setTimeLeft(prev => {
                if (prev <= 1) {
                    clearInterval(timer);
                    setFailed(true);
                    setTimeout(() => onFail(), 2000);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
        return () => clearInterval(timer);
    }, [failed, round]);

    const handleRoundComplete = () => {
        if (round === 1) {
            setRound(2);
        } else {
            onSuccess();
        }
    };

    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    const timeString = `${minutes < 10 ? '0' : ''}${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm z-50 p-4" onClick={onClose}>
            <div className="glass-panel w-full max-w-2xl max-h-[90vh] flex flex-col rounded-2xl overflow-hidden animate-[slide-up_0.3s_ease-out]" onClick={e => e.stopPropagation()}>
                <div className="bg-office-950/80 border-b border-office-700/50 p-5 flex justify-between items-center">
                    <h2 className="text-xl font-bold text-white m-0 flex items-center gap-2"><i className="fas fa-gamepad text-office-400"></i> Verifikasi Keamanan</h2>
                    <button className="text-office-400 hover:text-white bg-transparent border-none text-2xl cursor-pointer p-2 rounded-full hover:bg-office-800/50 transition-colors" onClick={onClose}><i className="fas fa-times"></i></button>
                </div>
                <div className="p-6 overflow-y-auto custom-scrollbar text-center text-office-100 flex flex-col items-center">
                    {failed ? (
                        <h2 className="text-red-500 font-bold text-2xl my-8">Analisis Gambar Gagal!</h2>
                    ) : (
                        <>
                            <div className={`text-xl font-bold ${timeLeft < 30 ? 'text-red-500 animate-pulse' : 'text-office-200'}`}>
                                Waktu Tersisa: {timeString}
                            </div>
                            <div className="px-4 py-1 bg-green-900/50 text-green-400 font-bold rounded-full border border-green-500/50 mt-3 mb-6 inline-block shadow-inner"> {round} dari 2</div>

                            {gameType === 'MEMORY' && <p className="text-office-300 font-medium mb-4">Match the Color</p>}
                            {gameType === 'PIPES' && <p className="text-office-300 font-medium mb-4">Connect and Fill All Tiles</p>}

                            {gameType === 'MEMORY' && <MemoryMatch round={round} onRoundComplete={handleRoundComplete} />}
                            {gameType === 'PIPES' && <ConnectPipes round={round} onRoundComplete={handleRoundComplete} />}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

const SpaceShooterModal = ({ onSuccess, onFail, onClose }) => {
    const canvasRef = useRef(null);
    const [lives, setLives] = useState(3);
    const [gameStatus, setGameStatus] = useState('PLAYING');

    const gameState = useRef({
        player: { x: 185, y: 360, width: 30, height: 20, speed: 5, color: '#3B82F6' },
        playerBullets: [],
        enemies: [],
        enemyDirection: 1,
        enemySpeedX: 1,
        enemySpeedY: 20,
        enemyBullets: [],
        lastEnemyShootTime: 0,
        lastTime: 0,
        keys: {},
        isGameOver: false,
    });

    useEffect(() => {
        const initGame = () => {
            const state = gameState.current;
            state.player.x = 200 - state.player.width / 2;
            state.playerBullets = [];
            state.enemyBullets = [];
            state.enemies = [];
            state.enemyDirection = 1;
            state.isGameOver = false;
            setLives(3);
            setGameStatus('PLAYING');

            const rows = 4;
            const cols = 5;
            const enemyColors = ['#EF4444', '#EAB308', '#F97316'];
            for (let r = 0; r < rows; r++) {
                for (let c = 0; c < cols; c++) {
                    state.enemies.push({
                        x: 50 + c * 60,
                        y: 30 + r * 40,
                        width: 30,
                        height: 25,
                        alive: true,
                        color: enemyColors[Math.floor(Math.random() * enemyColors.length)]
                    });
                }
            }
        };

        initGame();

        const handleKeyDown = (e) => {
            gameState.current.keys[e.code] = true;
            if (e.code === 'Space' && !gameState.current.isGameOver) {
                const state = gameState.current;
                if (state.playerBullets.length < 2) {
                    state.playerBullets.push({
                        x: state.player.x + state.player.width / 2 - 2.5,
                        y: state.player.y,
                        width: 5,
                        height: 10,
                        speed: 7
                    });
                }
            }
            if (['Space', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].indexOf(e.code) > -1) {
                e.preventDefault();
            }
        };

        const handleKeyUp = (e) => {
            gameState.current.keys[e.code] = false;
        };

        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('keyup', handleKeyUp);

        let animationFrameId;
        let timerId;

        const loop = (timestamp) => {
            const state = gameState.current;
            if (state.isGameOver) return;

            if (!state.lastTime) state.lastTime = timestamp;
            state.lastTime = timestamp;

            const canvas = canvasRef.current;
            if (!canvas) return;
            const ctx = canvas.getContext('2d');

            if (state.keys['ArrowLeft'] && state.player.x > 0) {
                state.player.x -= state.player.speed;
            }
            if (state.keys['ArrowRight'] && state.player.x < canvas.width - state.player.width) {
                state.player.x += state.player.speed;
            }

            for (let i = state.playerBullets.length - 1; i >= 0; i--) {
                let b = state.playerBullets[i];
                b.y -= b.speed;
                if (b.y < 0) {
                    state.playerBullets.splice(i, 1);
                }
            }

            let aliveEnemies = state.enemies.filter(e => e.alive);
            if (aliveEnemies.length === 0) {
                state.isGameOver = true;
                setGameStatus('WON');
                setTimeout(() => onSuccess(), 1000);
                return;
            }

            let hitWall = false;
            let lowestEnemyY = 0;
            aliveEnemies.forEach(e => {
                e.x += state.enemySpeedX * state.enemyDirection;
                if (e.x <= 0 || e.x + e.width >= canvas.width) {
                    hitWall = true;
                }
                if (e.y + e.height > lowestEnemyY) {
                    lowestEnemyY = e.y + e.height;
                }
            });

            if (hitWall) {
                state.enemyDirection *= -1;
                state.enemies.forEach(e => {
                    e.y += state.enemySpeedY;
                });
            }

            if (lowestEnemyY >= state.player.y) {
                state.isGameOver = true;
                setGameStatus('LOST');
                setTimeout(() => onFail(), 2000);
                return;
            }

            const now = Date.now();
            let shootInterval = 4000;
            if (aliveEnemies.length <= 8) shootInterval = 2000;
            else if (aliveEnemies.length <= 16) shootInterval = 3000;

            if (now - state.lastEnemyShootTime > shootInterval) {
                const shooter = aliveEnemies[Math.floor(Math.random() * aliveEnemies.length)];
                state.enemyBullets.push({
                    x: shooter.x + shooter.width / 2 - 2.5,
                    y: shooter.y + shooter.height,
                    width: 5,
                    height: 10,
                    speed: 4
                });
                state.lastEnemyShootTime = now;
            }

            for (let i = state.enemyBullets.length - 1; i >= 0; i--) {
                let b = state.enemyBullets[i];
                b.y += b.speed;
                if (b.y > canvas.height) {
                    state.enemyBullets.splice(i, 1);
                }
            }

            for (let i = state.playerBullets.length - 1; i >= 0; i--) {
                let pb = state.playerBullets[i];
                let hit = false;
                for (let j = 0; j < state.enemies.length; j++) {
                    let e = state.enemies[j];
                    if (e.alive && pb.x < e.x + e.width && pb.x + pb.width > e.x && pb.y < e.y + e.height && pb.y + pb.height > e.y) {
                        e.alive = false;
                        hit = true;
                        break;
                    }
                }
                if (hit) {
                    state.playerBullets.splice(i, 1);
                }
            }

            for (let i = state.enemyBullets.length - 1; i >= 0; i--) {
                let eb = state.enemyBullets[i];
                let p = state.player;
                if (eb.x < p.x + p.width && eb.x + eb.width > p.x && eb.y < p.y + p.height && eb.y + eb.height > p.y) {
                    state.enemyBullets.splice(i, 1);
                    setLives(prev => {
                        const newLives = prev - 1;
                        if (newLives <= 0) {
                            state.isGameOver = true;
                            setGameStatus('LOST');
                            setTimeout(() => onFail(), 2000);
                        }
                        return newLives;
                    });
                }
            }

            ctx.clearRect(0, 0, canvas.width, canvas.height);

            ctx.font = '24px Arial';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';

            ctx.shadowBlur = 15;
            ctx.shadowColor = '#39FF14';
            ctx.fillStyle = '#39FF14';
            ctx.fillText('Δ', state.player.x + state.player.width / 2, state.player.y + state.player.height / 2);
            ctx.shadowBlur = 0;

            state.enemies.forEach(e => {
                if (e.alive) {
                    ctx.shadowBlur = 10;
                    ctx.shadowColor = e.color;
                    ctx.fillStyle = e.color;
                    ctx.fillText('𖢥', e.x + e.width / 2, e.y + e.height / 2);
                    ctx.shadowBlur = 0;
                }
            });

            ctx.shadowBlur = 8;
            ctx.shadowColor = '#39FF14';
            ctx.fillStyle = '#39FF14';
            state.playerBullets.forEach(b => {
                ctx.fillRect(b.x, b.y, b.width, b.height);
            });
            ctx.shadowBlur = 0;

            ctx.shadowBlur = 8;
            ctx.shadowColor = '#F59E0B';
            ctx.fillStyle = '#F59E0B';
            state.enemyBullets.forEach(b => {
                ctx.fillRect(b.x, b.y, b.width, b.height);
            });
            ctx.shadowBlur = 0;

            animationFrameId = requestAnimationFrame(loop);
        };

        animationFrameId = requestAnimationFrame(loop);

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('keyup', handleKeyUp);
            cancelAnimationFrame(animationFrameId);
        };
    }, []);

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm z-50 p-4" onClick={onClose}>
            <div className="glass-panel w-full max-w-xl max-h-[90vh] flex flex-col rounded-2xl overflow-hidden animate-[slide-up_0.3s_ease-out]" onClick={e => e.stopPropagation()}>
                <div className="bg-office-950/80 border-b border-office-700/50 p-5 flex justify-between items-center">
                    <h2 className="text-xl font-bold text-white m-0 flex items-center gap-2"><i className="fas fa-space-shuttle text-office-400"></i> Keamanan Jaringan</h2>
                    <button className="text-office-400 hover:text-white bg-transparent border-none text-2xl cursor-pointer p-2 rounded-full hover:bg-office-800/50 transition-colors" onClick={onClose}><i className="fas fa-times"></i></button>
                </div>
                <div className="p-6 overflow-y-auto custom-scrollbar text-center text-office-100 flex flex-col items-center w-full">
                    {gameStatus === 'LOST' ? (
                        <h2 className="text-red-500 font-bold text-2xl my-8">Analisis Link Gagal!</h2>
                    ) : gameStatus === 'WON' ? (
                        <h2 className="text-green-400 font-bold text-2xl my-8 drop-shadow-[0_0_10px_rgba(74,222,128,0.5)]">Akses Diizinkan!</h2>
                    ) : (
                        <>
                            <div className="flex justify-end w-full max-w-[400px] mb-4">
                                <div className="text-lg font-bold text-office-300">
                                    <span className="text-red-500 drop-shadow-md">{'❤️'.repeat(lives)}</span>
                                </div>
                            </div>
                            <div className="flex justify-center w-full">
                                <canvas
                                    ref={canvasRef}
                                    width={400}
                                    height={400}
                                    className="bg-office-950 border-2 border-office-700 rounded-lg shadow-inner max-w-full"
                                />
                            </div>
                            <p className="mt-4 text-sm text-office-400">Gunakan <kbd className="bg-office-800 px-2 py-1 rounded text-white font-mono">◀</kbd> <kbd className="bg-office-800 px-2 py-1 rounded text-white font-mono">▶</kbd> untuk bergerak, <kbd className="bg-office-800 px-2 py-1 rounded text-white font-mono">Spasi</kbd> untuk menembak.</p>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

// Search Engine Modal
const SearchEngineModal = ({ onClose }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCompany, setSelectedCompany] = useState(null);

    const filteredCompanies = COMPANY_DB.filter(c => {
        if (!searchQuery) return false;
        const q = searchQuery.toLowerCase();
        return c.name.toLowerCase().includes(q) || c.keywords.some(k => k.toLowerCase().includes(q));
    });

    const renderCompanyPage = (company) => {
        switch (company.id) {
            case 'creamy_mango':
                return (
                    <div className="bg-gray-100 text-gray-900 p-8 h-full flex flex-col items-center text-center font-serif">
                        <div className="w-full max-w-2xl bg-white p-10 border border-gray-300 shadow-sm">
                            <i className={`fas ${company.icon} text-6xl text-yellow-500 mb-6`}></i>
                            <h2 className="text-3xl font-bold uppercase tracking-widest mb-4">{company.name}</h2>
                            <div className="w-16 h-1 bg-yellow-500 mx-auto mb-6"></div>
                            <p className="text-justify leading-relaxed mb-6">
                                Sejarah perbankan kami dimulai sejak tahun 1990 dengan visi dan misi untuk menjadi institusi keuangan terkemuka yang menjunjung tinggi nilai-nilai kepercayaan, integritas, dan profesionalisme. Kami berkomitmen memberikan layanan terbaik bagi nasabah korporat dengan standar keamanan tingkat tinggi.
                            </p>
                            <p className="text-justify leading-relaxed mb-12">
                                Setiap transaksi yang Anda lakukan diawasi secara ketat oleh otoritas terkait. Kami memastikan bahwa setiap protokol keamanan diimplementasikan tanpa kompromi demi kenyamanan Anda bertransaksi kapan saja dan di mana saja.
                            </p>

                            <div className="mt-auto pt-8 border-t border-gray-300 text-xs text-gray-500 text-left">
                                Syarat dan ketentuan berlaku. Jika Anda memiliki keluhan atau memerlukan bantuan teknis mengenai layanan perbankan Anda, silakan merujuk pada dokumen polis. Email Customer Service (noreply@creamymango.id) hanya melayani kendala sistem otomatis.
                            </div>
                        </div>
                    </div>
                );
            case 'banana_milk':
                return (
                    <div className="bg-yellow-50 text-gray-800 p-6 h-full font-sans">
                        <div className="bg-white rounded-lg shadow-md overflow-hidden">
                            <div className="bg-yellow-400 p-4 flex items-center gap-4">
                                <i className={`fas ${company.icon} text-3xl text-gray-800`}></i>
                                <h2 className="text-2xl font-bold text-gray-800 uppercase m-0">{company.name}</h2>
                            </div>
                            <div className="grid grid-cols-3 gap-6 p-6">
                                <div className="col-span-2">
                                    <h3 className="text-xl font-bold text-red-600 mb-4 animate-bounce">🚨 PROMO SUSU RASA BARU! 🚨</h3>
                                    <p className="mb-4">Dapatkan diskon khusus untuk distributor dan vendor yang melakukan pemesanan skala besar untuk varian rasa terbaru kami. Hubungi representatif kami untuk informasi lebih lanjut.</p>
                                    <p className="mb-4">Kualitas pabrik kami berstandar internasional dengan pengawasan ketat di setiap lini manufaktur. Kepuasan pelanggan adalah prioritas utama.</p>
                                    <div className="bg-gray-100 p-4 border border-gray-300 rounded">
                                        <h4 className="font-bold mb-2">Informasi Pabrik</h4>
                                        <ul className="list-disc pl-5">
                                            <li>Kapasitas Produksi: 100.000 liter/hari</li>
                                            <li>Sertifikasi: ISO 9001, Halal</li>
                                        </ul>
                                    </div>
                                </div>
                                <div className="col-span-1 bg-yellow-100 p-4 rounded-lg border-2 border-dashed border-yellow-400 h-fit">
                                    <h4 className="font-bold text-gray-700 mb-3 border-b border-yellow-300 pb-2">Kontak Vendor & Pengadaan</h4>
                                    <p className="text-sm mb-2">Tautan Portal Pengadaan Resmi:</p>
                                    <span className="text-blue-600 text-sm break-all font-mono mb-4 block">bananamilk.co.id/portal/vendor-catalog</span>
                                    <p className="text-sm mb-2">Email Procurement:</p>
                                    <span className="text-blue-600 font-bold break-all text-sm">procurement@bananamilk.co.id</span>
                                </div>
                            </div>
                        </div>
                    </div>
                );
            case 'spicy_lemon':
                return (
                    <div className="bg-black text-white p-0 h-full overflow-y-auto">
                        <div className="bg-gradient-to-r from-red-600 to-orange-500 p-12 text-center relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-4 opacity-20">
                                <i className={`fas ${company.icon} text-9xl`}></i>
                            </div>
                            <h2 className="text-5xl font-extrabold mb-4 relative z-10">{company.name}</h2>
                            <p className="text-2xl font-bold italic relative z-10">Revolusi AI untuk Pemasaran Anda</p>
                        </div>
                        <div className="p-8 max-w-4xl mx-auto text-center">
                            <h3 className="text-4xl font-bold text-yellow-400 mb-6 drop-shadow-[0_0_10px_rgba(250,204,21,0.8)] animate-pulse">COBA MODUL AI KAMI SEKARANG!</h3>

                            <div className="bg-red-900/50 border-2 border-red-500 rounded-xl p-6 mb-8 text-left">
                                <h4 className="text-red-400 font-bold text-xl mb-2 flex items-center gap-2"><i className="fas fa-exclamation-triangle"></i> Peringatan Keamanan</h4>
                                <p className="text-red-200">Awas Phishing! Jangan klik link sembarangan, kecuali link dari kami karena kami 100% aman (bercanda, tetap waspada ya!).</p>
                            </div>

                            <div className="text-left bg-gray-900 p-6 rounded-lg border border-gray-700 leading-relaxed text-gray-300">
                                <p className="mb-4">Modul analitik pemasaran kami dirancang menggunakan algoritma Deep Learning terkini. Kami dapat memprediksi perilaku konsumen dengan akurasi 99%.</p>
                                <p className="mb-4">Jika Anda tertarik untuk berkolaborasi atau memesan layanan kami secara langsung, Anda dapat menghubungi Email Sales Resmi (sales@spicylemon.com) yang selalu aktif 24/7 untuk melayani kebutuhan bisnis Anda secara cepat.</p>
                                <p>Jangan lewatkan kesempatan untuk meningkatkan konversi penjualan Anda hingga 300% dalam waktu kurang dari sebulan!</p>
                            </div>
                        </div>
                    </div>
                );
            case 'honeydew':
                return (
                    <div className="bg-white text-gray-900 h-full flex flex-col justify-start items-center overflow-y-auto px-8 pt-20 pb-8">
                        <div className="w-full max-w-md">
                            <h2 className="text-4xl font-light tracking-tight text-center mb-2">{company.name}</h2>
                            <p className="text-center text-gray-400 mb-12 opacity-50">Email Billing (billing@honeydew.tech)</p>

                            <div className="bg-gray-50 border border-gray-200 rounded-2xl p-8 flex flex-col items-center shadow-sm">
                                <div className="w-24 h-24 rounded-full bg-green-50 flex items-center justify-center mb-6">
                                    <i className={`fas ${company.icon} text-4xl text-green-500`}></i>
                                </div>
                                <h3 className="text-2xl font-medium mb-2">System Status</h3>
                                <div className="flex items-center gap-3 bg-green-100 text-green-800 px-4 py-2 rounded-full font-medium mb-8">
                                    <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse"></div>
                                    All Systems Operational
                                </div>

                                <div className="text-center border-t border-gray-200 pt-6">
                                    <p className="text-gray-600 text-sm leading-relaxed mb-5">
                                        Honeydew Inc. adalah penyedia layanan <strong>cloud hosting</strong> dan peladen data terdesentralisasi tingkat <em>enterprise</em>. Kami mendukung infrastruktur digital modern dengan keandalan maksimal.
                                    </p>
                                    <div className="flex flex-wrap justify-center gap-2">
                                        <span className="bg-gray-100 border border-gray-200 text-gray-500 text-xs px-2 py-1 rounded-md shadow-sm">Menjamin uptime 99.99%</span>
                                        <span className="bg-gray-100 border border-gray-200 text-gray-500 text-xs px-2 py-1 rounded-md shadow-sm">Infrastruktur server berpendingin cairan</span>
                                        <span className="bg-gray-100 border border-gray-200 text-gray-500 text-xs px-2 py-1 rounded-md shadow-sm">Perlindungan DDoS tingkat lanjut</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                );
            case 'avocado_store':
                return (
                    <div className="bg-purple-900 text-white p-6 h-full overflow-y-auto font-sans">
                        <div className="flex items-center justify-center gap-4 mb-6 pt-4">
                            <i className={`fas ${company.icon} text-5xl text-green-400`}></i>
                            <h2 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-500">{company.name}</h2>
                        </div>

                        <div className="max-w-4xl mx-auto text-center mb-10">
                            <p className="text-lg text-white/80 leading-relaxed">
                                Avocado Store adalah penyedia aset digital, UI Kit, dan vektor terkemuka untuk desainer profesional di seluruh dunia. Berdayakan proyek kreatif Anda dengan koleksi premium kami.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto mb-12">
                            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-8 flex flex-col items-center transform transition-transform hover:scale-105">
                                <h3 className="text-2xl font-bold mb-2">Basic</h3>
                                <div className="text-4xl font-extrabold text-green-400 mb-6">$15<span className="text-base font-normal text-white/50">/bln</span></div>
                                <ul className="space-y-4 mb-8 w-full">
                                    <li className="flex items-center gap-3 text-white/90"><i className="fas fa-check text-green-400"></i> Akses 100 aset per hari</li>
                                    <li className="flex items-center gap-3 text-white/90"><i className="fas fa-check text-green-400"></i> Lisensi personal</li>
                                    <li className="flex items-center gap-3 text-white/40"><i className="fas fa-times"></i> Resolusi 4K</li>
                                </ul>
                                <button className="mt-auto w-full py-3 bg-white/10 hover:bg-white/20 text-white font-bold rounded-xl transition-colors border border-white/20">Berlangganan</button>
                            </div>

                            <div className="bg-gradient-to-b from-green-500/90 to-blue-600/90 backdrop-blur-md border border-white/30 rounded-2xl p-8 flex flex-col items-center transform md:scale-105 shadow-2xl relative">
                                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-yellow-400 text-black text-xs font-extrabold px-4 py-1 rounded-full uppercase tracking-wider">
                                    Paling Populer
                                </div>
                                <h3 className="text-2xl font-bold mb-2">Pro</h3>
                                <div className="text-4xl font-extrabold text-white mb-6">$35<span className="text-base font-normal text-white/70">/bln</span></div>
                                <ul className="space-y-4 mb-8 w-full">
                                    <li className="flex items-center gap-3 text-white"><i className="fas fa-check text-yellow-300"></i> Unduh aset tanpa batas</li>
                                    <li className="flex items-center gap-3 text-white"><i className="fas fa-check text-yellow-300"></i> Lisensi komersial</li>
                                    <li className="flex items-center gap-3 text-white"><i className="fas fa-check text-yellow-300"></i> Resolusi 4K & File Mentah</li>
                                </ul>
                                <button className="mt-auto w-full py-3 bg-white hover:bg-gray-100 text-blue-600 font-bold rounded-xl transition-colors shadow-lg">Berlangganan</button>
                            </div>

                            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-8 flex flex-col items-center transform transition-transform hover:scale-105">
                                <h3 className="text-2xl font-bold mb-2">Studio</h3>
                                <div className="text-4xl font-extrabold text-green-400 mb-6">$99<span className="text-base font-normal text-white/50">/bln</span></div>
                                <ul className="space-y-4 mb-8 w-full">
                                    <li className="flex items-center gap-3 text-white/90"><i className="fas fa-check text-green-400"></i> Semua fitur Pro</li>
                                    <li className="flex items-center gap-3 text-white/90"><i className="fas fa-check text-green-400"></i> Akun multi-pengguna (5)</li>
                                    <li className="flex items-center gap-3 text-white/90"><i className="fas fa-check text-green-400"></i> Dukungan prioritas 24/7</li>
                                </ul>
                                <button className="mt-auto w-full py-3 bg-white/10 hover:bg-white/20 text-white font-bold rounded-xl transition-colors border border-white/20">Berlangganan</button>
                            </div>
                        </div>

                        <div className="text-center text-white/40 text-sm mt-12 pb-6 border-t border-white/10 pt-6">
                            &copy; 2026 Avocado Store. Domain terdaftar: avocado-ent.com. Semua Hak Cipta Dilindungi.
                        </div>
                    </div>
                );
            case 'bitter_melon':
                return (
                    <div className="bg-gray-900 text-white p-8 h-full overflow-y-auto font-sans">
                        <div className="flex items-center gap-4 border-b border-green-500/30 pb-6 mb-8">
                            <i className={`fas ${company.icon} text-5xl text-green-500`}></i>
                            <div>
                                <h2 className="text-3xl font-bold tracking-wider m-0">{company.name}</h2>
                                <p className="text-green-400 text-sm font-mono mt-1">Interactive Entertainment & Engine Development</p>
                            </div>
                        </div>

                        <h3 className="text-xl font-semibold mb-4 border-l-4 border-green-500 pl-3">Featured Products</h3>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16">
                            <div className="bg-gray-800 h-32 rounded-lg flex items-center justify-center border border-gray-700 hover:border-green-500 transition-colors shadow-lg cursor-pointer">Project: NEON</div>
                            <div className="bg-gray-800 h-32 rounded-lg flex items-center justify-center border border-gray-700 hover:border-green-500 transition-colors shadow-lg cursor-pointer">Engine V5 Beta</div>
                            <div className="bg-gray-800 h-32 rounded-lg flex items-center justify-center border border-gray-700 hover:border-green-500 transition-colors shadow-lg cursor-pointer">Cyber Souls</div>
                            <div className="bg-gray-800 h-32 rounded-lg flex items-center justify-center border border-gray-700 hover:border-green-500 transition-colors shadow-lg cursor-pointer">Asset Pack Vol.1</div>
                        </div>

                        <div className="mt-auto pt-10 border-t border-gray-800 text-xs text-gray-500 flex flex-col items-center text-center">
                            <p className="mb-2">&copy; 2026 Bitter Melon, LLC. All rights reserved. Domain: bittermelon.io</p>
                            <p className="opacity-30 hover:opacity-100 transition-opacity duration-300">
                                Press Kit & Business Inquiries: collab@bittermelon.io | legal@bittermelon.io | art-team@bittermelon.io
                            </p>
                        </div>
                    </div>
                );
            case 'starfruit_law':
                return (
                    <div className="bg-stone-100 text-stone-900 p-8 h-full overflow-y-auto font-serif flex justify-center items-start">
                        <div className="w-full max-w-3xl bg-white p-10 md:p-14 shadow-xl border-t-8 border-yellow-600 h-fit">
                            <div className="text-center mb-12 border-b border-stone-200 pb-8">
                                <i className={`fas ${company.icon} text-6xl text-yellow-600 mb-6`}></i>
                                <h2 className="text-4xl font-bold uppercase tracking-widest text-stone-800 m-0">{company.name}</h2>
                                <p className="text-sm tracking-widest text-stone-500 mt-4 uppercase font-semibold">Keadilan & Integritas</p>
                            </div>

                            <div className="space-y-6 text-justify leading-relaxed text-stone-700">
                                <p>Firma hukum kami telah melayani berbagai korporasi multinasional selama lebih dari dua dekade. Kami berspesialisasi dalam hukum perdata, litigasi korporat, dan penyelesaian sengketa hak kekayaan intelektual dengan standar profesionalisme tertinggi.</p>

                                <h3 className="text-xl font-bold text-stone-800 mt-10 mb-4">Area Praktik</h3>
                                <ul className="list-disc pl-5 mb-8 space-y-2 marker:text-yellow-600">
                                    <li>Hukum Perdata & Pidana Korporat</li>
                                    <li>Penyusunan Non-Disclosure Agreement (NDA)</li>
                                    <li>Mediasi & Arbitrase Bisnis</li>
                                </ul>

                                <h3 className="text-lg font-bold text-stone-800 mt-12 mb-3">Syarat & Ketentuan Konsultasi</h3>
                                <p className="text-xs text-stone-500 leading-loose bg-stone-50 p-4 border border-stone-200 rounded">
                                    Dengan mengakses layanan konsultasi awal, klien menyetujui bahwa segala bentuk komunikasi dilindungi oleh hak istimewa pengacara-klien. Firma berhak menolak representasi jika terdapat benturan kepentingan. Seluruh korespondensi resmi, termasuk pengiriman draf kontrak atau somasi, hanya akan dilakukan melalui domain resmi kami yaitu starfruitlaw.co.id. Untuk pertanyaan administrasi atau jadwal temu, klien dapat mengirimkan surel ke admin@starfruitlaw.co.id atau legal@starfruitlaw.co.id. Pembayaran hanya sah jika ditransfer ke rekening yang tertera pada faktur fisik yang dibubuhi cap basah firma. Kegagalan mematuhi ketentuan ini membebaskan firma dari segala tuntutan kelalaian.
                                </p>
                            </div>
                        </div>
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm z-50 p-4" onClick={onClose}>
            <div className="glass-panel w-full max-w-4xl h-[80vh] flex flex-col rounded-2xl overflow-hidden animate-[slide-up_0.3s_ease-out]" onClick={e => e.stopPropagation()}>

                {selectedCompany ? (
                    <div className="flex flex-col h-full bg-white relative">
                        <div className="absolute top-4 left-4 z-50">
                            <button
                                className="w-10 h-10 bg-black/50 hover:bg-black/80 text-white rounded-full flex items-center justify-center transition-colors shadow-lg backdrop-blur-md"
                                onClick={() => {
                                    setSelectedCompany(null);
                                    setSearchQuery('');
                                }}
                            >
                                <i className="fas fa-arrow-left"></i>
                            </button>
                        </div>
                        <div className="flex-1 overflow-y-auto">
                            {renderCompanyPage(selectedCompany)}
                        </div>
                    </div>
                ) : (
                    <>
                        <div className="bg-office-950/80 border-b border-office-700/50 p-5 flex justify-between items-center">
                            <h2 className="text-xl font-bold text-white m-0 flex items-center gap-2"><i className="fas fa-magnifying-glass text-office-400"></i> Search</h2>
                            <button className="text-office-400 hover:text-white bg-transparent border-none text-2xl cursor-pointer p-2 rounded-full hover:bg-office-800/50 transition-colors" onClick={onClose}><i className="fas fa-times"></i></button>
                        </div>
                        <div className="p-8 flex flex-col items-center flex-1 overflow-y-auto custom-scrollbar">
                            <div className="w-full max-w-2xl mt-4 mb-8 relative">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <i className="fas fa-search text-office-400 text-xl"></i>
                                </div>
                                <input
                                    type="text"
                                    className="w-full bg-office-900/80 border-2 border-office-600 focus:border-office-400 text-white rounded-xl py-4 pl-12 pr-4 text-xl shadow-[inset_0_2px_10px_rgba(0,0,0,0.3)] transition-colors"
                                    placeholder="Cari nama perusahaan..."
                                    maxLength={20}
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>

                            <div className="w-full max-w-2xl">
                                {!searchQuery ? (
                                    <div className="text-center text-office-400 text-lg mt-10">
                                        <i className="fas fa-keyboard text-4xl mb-4 opacity-50 block relative -left-[4px] top-[8px]"></i>
                                        Cari nama perusahaan
                                    </div>
                                ) : filteredCompanies.length > 0 ? (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {filteredCompanies.map(c => (
                                            <div
                                                key={c.id}
                                                className="bg-office-800/60 hover:bg-office-700 border border-office-600 rounded-xl p-4 flex items-center gap-4 cursor-pointer transition-all hover:-translate-y-1 hover:shadow-[0_5px_15px_rgba(2,132,199,0.3)]"
                                                onClick={() => setSelectedCompany(c)}
                                            >
                                                <div className="w-12 h-12 bg-office-900 rounded-lg flex items-center justify-center shrink-0">
                                                    <i className={`fas ${c.icon} ${c.iconColor} text-xl`}></i>
                                                </div>
                                                <div>
                                                    <h3 className="font-bold text-white m-0">{c.name}</h3>
                                                    <p className="text-xs text-office-400 truncate mt-1">
                                                        {c.keywords.slice(0, 3).join(', ')}...
                                                    </p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center text-red-400 text-lg mt-10 bg-red-900/20 p-6 rounded-xl border border-red-500/30">
                                        <i className="fas fa-exclamation-circle text-4xl mb-4 block relative -left-[4px] top-[8px]"></i>
                                        Data entitas tidak ditemukan di dalam sistem
                                    </div>
                                )}
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

const MainMenu = () => {
    const { startGame } = useGame();
    const [activeScreen, setActiveScreen] = useState('main'); // 'main', 'guide', 'loading'
    const [loadingProgress, setLoadingProgress] = useState(0);
    const [loadingText, setLoadingText] = useState('Menghubungkan ke server perusahaan...');

    const handleStartGame = () => {
        setActiveScreen('loading');

        setTimeout(() => { setLoadingProgress(30); setLoadingText("Memuat basis data karyawan..."); }, 500);
        setTimeout(() => { setLoadingProgress(70); setLoadingText("Mendekripsi laporan terbaru..."); }, 1500);
        setTimeout(() => { setLoadingProgress(100); setLoadingText("Akses Diberikan."); }, 2500);

        setTimeout(() => {
            startGame();
        }, 3000);
    };

    return (
        <div className="flex items-center justify-center h-screen w-full overflow-hidden relative z-10">
            <style>{`
                @keyframes float {
                    0% { transform: translateY(0px); }
                    50% { transform: translateY(-10px); }
                    100% { transform: translateY(0px); }
                }
                .float-anim { animation: float 4s ease-in-out infinite; }
                
                .btn-office {
                    position: relative;
                    overflow: hidden;
                    transition: all 0.3s ease;
                }
                .btn-office::after {
                    content: '';
                    position: absolute;
                    top: 0;
                    left: -100%;
                    width: 100%;
                    height: 100%;
                    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
                    transition: left 0.5s ease;
                }
                .btn-office:hover::after { left: 100%; }
                .btn-office:active { transform: scale(0.98); }
            `}</style>

            <div className="absolute -top-20 -right-20 w-96 h-96 bg-office-600 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse pointer-events-none"></div>
            <div className="absolute -bottom-20 -left-20 w-72 h-72 bg-office-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse pointer-events-none" style={{ animationDelay: '2s' }}></div>

            <div className="w-full max-w-4xl h-[600px] relative z-10 overflow-hidden rounded-2xl shadow-2xl border border-office-700/50 bg-office-950/60 backdrop-blur-sm flex">

                {activeScreen === 'main' && (
                    <div className="flex flex-col md:flex-row w-full h-full animate-[slide-up_0.5s_ease-out]">
                        <div className="w-full md:w-1/2 h-1/2 md:h-full flex flex-col items-center justify-center p-8 border-b md:border-b-0 md:border-r border-office-700/30">
                            <div className="float-anim flex flex-col items-center">
                                <div className="relative w-32 h-32 mb-6">
                                    <div className="absolute inset-0 bg-office-500 rounded-lg transform -rotate-6 shadow-lg opacity-80"></div>
                                    <div className="absolute inset-0 bg-office-200 rounded-lg transform rotate-3 shadow-lg flex items-center justify-center">
                                        <i className="fa-solid fa-file-contract text-5xl text-office-800"></i>
                                    </div>
                                    <div className="absolute -bottom-2 -right-2 bg-red-500 w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border-2 border-white shadow-md text-white">
                                        5
                                    </div>
                                </div>
                                <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white to-office-300 mb-2 drop-shadow-sm text-center pb-2">
                                    Flagged
                                </h1>
                                <p className="text-office-300/80 text-sm md:text-base font-medium tracking-widest uppercase mt-[2px]">
                                    Corporate Investigation Simulator
                                </p>
                            </div>
                        </div>

                        <div className="w-full md:w-1/2 h-1/2 md:h-full flex flex-col items-center justify-center p-8 lg:p-12">
                            <div className="w-full max-w-sm space-y-4">
                                <button onClick={handleStartGame} className="btn-office group w-full bg-office-600 hover:bg-office-500 text-white font-semibold py-4 px-6 rounded-xl shadow-lg border border-office-400/30 flex items-center justify-between">
                                    <div className="flex items-center space-x-3">
                                        <i className="fa-solid fa-play text-office-200 group-hover:text-white transition-colors"></i>
                                        <span className="text-lg">Mulai Bermain</span>
                                    </div>
                                    <i className="fa-solid fa-chevron-right opacity-0 group-hover:opacity-100 transform translate-x-[-10px] group-hover:translate-x-0 transition-all"></i>
                                </button>
                                <button onClick={() => setActiveScreen('guide')} className="btn-office group w-full bg-office-800/80 hover:bg-office-700 text-office-100 font-semibold py-4 px-6 rounded-xl shadow-md border border-office-600/30 flex items-center justify-between backdrop-blur-sm">
                                    <div className="flex items-center space-x-3">
                                        <i className="fa-solid fa-book text-office-400 group-hover:text-office-200 transition-colors"></i>
                                        <span className="text-lg">Panduan Bermain</span>
                                    </div>
                                    <i className="fa-solid fa-chevron-right opacity-0 group-hover:opacity-100 transform translate-x-[-10px] group-hover:translate-x-0 transition-all text-office-400"></i>
                                </button>
                                <div className="mt-8 pt-6 border-t border-office-700/50 flex justify-between items-center text-xs text-office-400 font-mono">
                                    <span>v1.0.4 [BUILD_482]</span>
                                    <span className="flex items-center"><span className="w-2 h-2 rounded-full bg-green-500 mr-2 animate-pulse"></span> SYSTEM ONLINE</span>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {activeScreen === 'guide' && (
                    <div className="bg-office-900 w-full h-full flex flex-col animate-[slide-up_0.3s_ease-out]">
                        <div className="h-16 border-b border-office-700/50 flex items-center justify-between px-6 bg-office-950/80 shrink-0">
                            <div className="flex items-center space-x-3 text-office-200">
                                <i className="fa-solid fa-book-open"></i>
                                <h2 className="font-semibold text-lg m-0">Manual Pegawai</h2>
                            </div>
                            <button onClick={() => setActiveScreen('main')} className="text-office-400 hover:text-white transition-colors p-2 rounded-lg hover:bg-office-800 bg-transparent border-none cursor-pointer">
                                <i className="fa-solid fa-xmark text-xl"></i>
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto p-6 md:p-8 custom-scrollbar">
                            <div className="max-w-2xl mx-auto glass-panel rounded-xl p-6 md:p-10 text-office-100">
                                <div className="border-b-2 border-office-600 pb-4 mb-6 text-left">
                                    <h3 className="text-2xl font-bold text-white mb-1 m-0">Panduan Penggunaan Sistem</h3>
                                    <p className="text-office-400 text-sm font-mono m-0">ID Dokumen: PR-882-A // Rahasia Perusahaan</p>
                                </div>

                                <div className="space-y-6 text-sm md:text-base leading-relaxed text-office-200 text-left">
                                    <section>
                                        <h4 className="text-office-300 font-semibold text-lg mb-2 flex items-center m-0">
                                            <i className="fa-solid fa-user-tie mr-2 text-office-500"></i> Peran Anda
                                        </h4>
                                        <p className="m-0">Selamat datang di Departemen Audit Internal. Sebagai analis, tugas Anda adalah memverifikasi laporan-laporan yang masuk, mencari ketidaksesuaian data, dan memastikan tidak ada pelanggaran protokol.</p>
                                    </section>

                                    <section>
                                        <h4 className="text-office-300 font-semibold text-lg mb-2 flex items-center m-0">
                                            <i className="fa-solid fa-desktop mr-2 text-office-500"></i> Antarmuka Terminal
                                        </h4>
                                        <ul className="list-disc pl-5 space-y-2 marker:text-office-600 m-0">
                                            <li>Gunakan panel sebelah kiri untuk membaca laporan harian.</li>
                                            <li>Panel kanan digunakan untuk melakukan berbagai analisis dan verifikasi silang.</li>
                                            <li>Tandai dokumen sebagai <span className="text-green-400 font-semibold px-1 bg-green-400/10 rounded">AMAN</span> atau <span className="text-red-400 font-semibold px-1 bg-red-400/10 rounded">PHISHING</span>.</li>
                                        </ul>
                                    </section>

                                    <section className="bg-office-800/50 p-4 rounded-lg border border-office-700/50 mt-4">
                                        <h4 className="text-yellow-400 font-semibold mb-1 flex items-center m-0">
                                            <i className="fa-solid fa-triangle-exclamation mr-2"></i> Peringatan
                                        </h4>
                                        <p className="text-sm text-office-300 m-0">Setiap keputusan yang Anda buat akan dicatat. Keputusan yang salah dapat mengakibatkan penalti pada evaluasi kinerja Anda. Tetap teliti.</p>
                                    </section>
                                </div>
                            </div>
                        </div>

                        <div className="h-14 border-t border-office-700/50 flex items-center justify-center bg-office-950/80 shrink-0">
                            <button onClick={() => setActiveScreen('main')} className="px-6 py-2 bg-office-700 hover:bg-office-600 text-white text-sm font-medium rounded-lg transition-colors border border-office-500/50 shadow-sm cursor-pointer">
                                Kembali ke Menu
                            </button>
                        </div>
                    </div>
                )}

                {activeScreen === 'loading' && (
                    <div className="bg-office-950 w-full h-full flex flex-col items-center justify-center z-50">
                        <div className="text-office-400 mb-4 text-4xl animate-pulse">
                            <i className="fa-solid fa-server"></i>
                        </div>
                        <div className="w-64 h-2 bg-office-800 rounded-full overflow-hidden">
                            <div className="h-full bg-office-400 transition-all duration-1000 ease-out" style={{ width: `${loadingProgress}%` }}></div>
                        </div>
                        <p className="mt-4 font-mono text-sm text-office-400">{loadingText}</p>
                    </div>
                )}
            </div>
        </div>
    );
};

const NumberMemoryModal = ({ document, onSuccess, onFail, startAtResult }) => {
    const [timeLeft, setTimeLeft] = useState(60);
    const [round, setRound] = useState(1);
    const [targetNumbers, setTargetNumbers] = useState([]);
    const [playerInput, setPlayerInput] = useState([]);
    const [phase, setPhase] = useState(startAtResult ? 'RESULT' : 'SHOW'); // SHOW, INPUT, RESULT
    const [isFailed, setIsFailed] = useState(false);

    const generateNumbers = (count) => {
        return Array.from({ length: count }, () => Math.floor(Math.random() * 10).toString());
    };

    const startRound = (r) => {
        const count = r === 1 ? 4 : 5;
        setTargetNumbers(generateNumbers(count));
        setPlayerInput([]);
        setPhase('SHOW');
    };

    useEffect(() => {
        if (!startAtResult) startRound(1);
    }, [startAtResult]);

    // Global Timer
    useEffect(() => {
        if (phase === 'RESULT' || isFailed) return;
        const t = setInterval(() => {
            setTimeLeft(prev => {
                if (prev <= 1) {
                    clearInterval(t);
                    setIsFailed(true);
                    setTimeout(() => onFail(), 2000);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
        return () => clearInterval(t);
    }, [phase, isFailed, onFail]);

    // Show Timer
    useEffect(() => {
        if (phase === 'SHOW') {
            const t = setTimeout(() => {
                setPhase('INPUT');
            }, 5000);
            return () => clearTimeout(t);
        }
    }, [phase, targetNumbers]);

    const handleNumberClick = (num) => {
        if (phase !== 'INPUT' || isFailed || playerInput.length >= targetNumbers.length) return;
        const newInput = [...playerInput, num.toString()];
        setPlayerInput(newInput);

        if (newInput.length === targetNumbers.length) {
            const isMatch = newInput.join('') === targetNumbers.join('');
            if (isMatch) {
                if (round === 1) {
                    setRound(2);
                    startRound(2);
                } else {
                    setPhase('RESULT');
                }
            } else {
                setTimeout(() => setPlayerInput([]), 500);
            }
        }
    };

    const handleRestart = () => {
        if (phase === 'INPUT') {
            startRound(round);
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-office-950/90 backdrop-blur-sm p-4">
            <div className="bg-office-900 border border-office-700/50 rounded-xl p-8 max-w-lg w-full text-center relative shadow-2xl">
                <button onClick={onFail} className="absolute top-3 right-3 text-office-400 hover:text-white bg-transparent border-none text-xl cursor-pointer p-2 rounded-full hover:bg-office-800/50 transition-colors z-50">
                    <i className="fas fa-times"></i>
                </button>
                {isFailed ? (
                    <div className="text-red-500 text-2xl font-bold animate-pulse mt-4">Scanning failed...</div>
                ) : phase === 'RESULT' ? (
                    <div className="text-left">
                        <h3 className="text-2xl font-bold text-office-100 mb-6 text-center border-b border-office-700 pb-4">Scanner Result</h3>
                        <div className="space-y-4 mb-8">
                            {[
                                { name: 'Potato Defend', delay: 100 },
                                { name: 'Carrot V4', delay: 300 },
                                { name: 'XPepper', delay: 500 }
                            ].map((vendor, i) => {
                                let status = document.isPhishing ? 'Malware' : 'Undetected';
                                let isDanger = document.isPhishing;

                                if (document.id === 'E1' && vendor.name === 'Carrot V4') {
                                    status = 'Malware';
                                    isDanger = true;
                                }

                                return (
                                    <div key={i} className={`p-4 rounded border flex justify-between items-center animate-[fade-in_0.5s_ease-out]`} style={{ animationDelay: `${vendor.delay}ms`, animationFillMode: 'both' }}>
                                        <span className="text-office-200 font-semibold">{vendor.name}</span>
                                        <span className={`font-mono font-bold ${isDanger ? 'text-red-500' : 'text-green-500'}`}>{status}</span>
                                    </div>
                                );
                            })}
                        </div>
                        {document.id === 'E1' && (
                            <p className="text-red-400 text-sm mb-6 text-center italic">Disclaimer: Sistem mendeteksi kemungkinan False Positive pada dokumen berenkripsi makro.</p>
                        )}
                        <button onClick={onSuccess} className="w-full bg-office-700 hover:bg-office-600 text-white font-bold py-3 rounded transition-colors">Tutup Laporan</button>
                    </div>
                ) : (
                    <>
                        <div className="absolute top-4 left-4 text-office-300 font-mono text-xl flex items-center gap-2">
                            <i className="fa-solid fa-clock"></i> {timeLeft}s
                        </div>
                        <h3 className="text-xl font-bold text-office-200 mb-2 mt-4">Round {round}/2</h3>
                        <p className="text-office-400 mb-8 text-sm">Memorize the sequence</p>

                        <div className="h-24 flex items-center justify-center mb-8">
                            {phase === 'SHOW' ? (
                                <div className="text-5xl font-mono tracking-[1em] text-office-100 ml-4 font-bold">{targetNumbers.join('')}</div>
                            ) : (
                                <div className="text-5xl font-mono tracking-[1em] text-office-300 ml-4 font-bold">
                                    {playerInput.join('')}
                                    {'_'.repeat(Math.max(0, targetNumbers.length - playerInput.length))}
                                </div>
                            )}
                        </div>

                        {phase === 'INPUT' && (
                            <div className="grid grid-cols-3 gap-3 max-w-xs mx-auto">
                                {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => (
                                    <button key={num} onClick={() => handleNumberClick(num)} className="bg-office-800 hover:bg-office-700 active:bg-office-600 text-office-200 text-2xl font-bold py-4 rounded transition-colors">{num}</button>
                                ))}
                                <button onClick={handleRestart} className="bg-office-800/50 hover:bg-office-700 text-office-400 py-4 rounded transition-colors flex items-center justify-center"><i className="fa-solid fa-rotate-right"></i></button>
                                <button onClick={() => handleNumberClick(0)} className="bg-office-800 hover:bg-office-700 active:bg-office-600 text-office-200 text-2xl font-bold py-4 rounded transition-colors">0</button>
                                <div className="bg-office-900"></div>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

const Workspace = () => {
    const { documents, currentDocIndex, aiUsesLeft, makeDecision, useAi } = useGame();
    const [showSearchEngine, setShowSearchEngine] = useState(false);
    const [showAiModal, setShowAiModal] = useState(false);
    const [showImageAnalysis, setShowImageAnalysis] = useState(false);
    const [showLinkAnalysis, setShowLinkAnalysis] = useState(false);
    const [isAiLoading, setIsAiLoading] = useState(false);
    const [aiResult, setAiResult] = useState('');
    const [aiError, setAiError] = useState('');
    const [isImageAnalysisUnlocked, setIsImageAnalysisUnlocked] = useState(false);
    const [showMinigameModal, setShowMinigameModal] = useState(false);
    const [isLinkAnalysisUnlocked, setIsLinkAnalysisUnlocked] = useState(false);
    const [showSpaceShooter, setShowSpaceShooter] = useState(false);
    const [showNumberMemory, setShowNumberMemory] = useState(false);
    const [unlockedFileScan, setUnlockedFileScan] = useState(false);

    const currentDoc = documents[currentDocIndex];

    useEffect(() => {
        setShowImageAnalysis(false);
        setShowLinkAnalysis(false);
        setIsImageAnalysisUnlocked(false);
        setShowMinigameModal(false);
        setAiResult('');
        setAiError('');
        setIsLinkAnalysisUnlocked(false);
        setShowSpaceShooter(false);
        setShowNumberMemory(false);
        setUnlockedFileScan(false);
    }, [currentDocIndex]);

    const handleAnalyzeAI = () => {
        if (aiUsesLeft <= 0 && !aiResult) { setAiError("Kuota AI sudah habis."); return; }
        setIsAiLoading(true); setAiError('');

        setTimeout(() => {
            setAiResult(currentDoc.aiReport);
            useAi();
            setIsAiLoading(false);
        }, 800); // Simulate processing time
    };

    if (!currentDoc) return null;

    return (
        <div className="flex flex-col md:flex-row h-screen overflow-hidden text-office-100 p-6 gap-6 relative z-10 max-w-7xl mx-auto w-full">
            {/* Main Document Viewer */}
            <div className="glass-panel rounded-xl flex-1 flex flex-col p-6 md:p-8 border-t-4 border-t-office-500 overflow-y-auto custom-scrollbar">
                <div className="flex justify-between items-center mb-6 border-b border-office-700/50 pb-4">
                    <div className="font-bold text-office-300 text-lg md:text-xl tracking-wide"><i className="fas fa-shield-alt mr-2 text-office-400"></i> Inbox - Security Review Queue</div>
                    <div className="px-4 py-1 bg-office-900 text-office-200 text-sm font-semibold rounded-full border border-office-700 shadow-inner">Dokumen {currentDocIndex + 1} / 5</div>
                </div>

                <div key={currentDoc.id} className="animate-[slide-up_0.3s_ease-out]">
                    <div className="border-b border-office-800 pb-4 mb-6">
                        {currentDoc.forwarder && (
                            <div className="mb-6 bg-office-900/40 p-4 rounded-lg border-l-4 border-office-500 text-office-200 shadow-[inset_0_2px_10px_rgba(0,0,0,0.2)]">
                                <div className="mb-1 text-sm md:text-base"><strong>Diteruskan oleh:</strong> <span className="text-office-100">{currentDoc.forwarder}</span></div>
                                <div className="mb-1 text-sm md:text-base"><strong>Kepada:</strong> <span className="text-office-100">Tim IT Security</span></div>
                                <div className="italic mt-3 text-office-300 border-t border-office-800/50 pt-3 text-sm md:text-base leading-relaxed">"{currentDoc.forwardNote}"</div>
                            </div>
                        )}
                        <div className="mb-2 text-office-300 text-sm md:text-base"><strong>Dari:</strong> <span className="text-office-100 font-medium">{currentDoc.sender}</span></div>
                        <div className="text-xl md:text-2xl font-bold text-white mt-1"><strong>Subjek:</strong> {currentDoc.subject}</div>
                    </div>
                    <div className="whitespace-pre-wrap leading-relaxed text-office-100 text-base md:text-lg">{currentDoc.content}</div>
                    {currentDoc.type === POOL_TYPES.LINK && (
                        <div className="mt-8 p-4 bg-office-950/80 rounded-lg border border-office-700/50 break-all text-office-300 flex items-start gap-3 shadow-inner">
                            <i className="fas fa-link mt-1 text-office-500"></i>
                            <span className="font-mono text-sm">{currentDoc.link}</span>
                        </div>
                    )}
                    {currentDoc.type === POOL_TYPES.FILE && (
                        <div className="mt-8 flex flex-col items-center justify-center p-8 bg-office-950/50 rounded-lg border border-office-800 shadow-inner">
                            <i className="fa-solid fa-file-pdf text-6xl text-red-500/80 mb-4 drop-shadow-md"></i>
                            <h3 className="text-xl font-bold text-office-100 mb-2">{currentDoc.file}</h3>
                            <p className="text-office-400 text-sm text-center">Encrypted attachment. Requires local scanning.</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Sidebar Toolbar */}
            <div className="glass-panel w-full md:w-80 p-6 flex flex-col rounded-xl h-fit shadow-2xl">
                <h2 className="text-xl font-bold text-center mb-6 text-office-200 border-b border-office-800 pb-4 uppercase tracking-wider text-sm">Toolbar Analisis</h2>

                <div className="self-center mb-8 px-5 py-2 bg-office-900 border border-office-700 rounded-full text-office-300 text-sm font-bold flex items-center gap-2 shadow-inner">
                    <i className="fas fa-robot text-office-500"></i> LISA: {aiUsesLeft}x tersisa
                </div>

                <div className="flex flex-col gap-3 flex-1 mb-8">
                    <button className="w-full text-left px-4 py-3 bg-office-800/40 hover:bg-office-700/60 border border-office-700/50 rounded-lg transition-colors text-office-200 font-medium flex items-center gap-3" onClick={() => setShowSearchEngine(true)}>
                        <div className="bg-office-900 w-8 h-8 rounded flex items-center justify-center text-office-400"><i className="fas fa-magnifying-glass"></i></div> Search
                    </button>
                    <button className="w-full text-left px-4 py-3 bg-office-800/40 hover:bg-office-700/60 border border-office-700/50 rounded-lg transition-colors text-office-200 font-medium flex items-center gap-3" onClick={() => setShowAiModal(true)}>
                        <div className="bg-office-900 w-8 h-8 rounded flex items-center justify-center text-office-400"><i className="fas fa-robot"></i></div> LISA
                    </button>
                    {currentDoc.type === POOL_TYPES.IMAGE && (
                        <button className="w-full text-left px-4 py-3 bg-office-800/40 hover:bg-office-700/60 border border-office-700/50 rounded-lg transition-colors text-office-200 font-medium flex justify-between items-center" onClick={() => {
                            if (isImageAnalysisUnlocked) setShowImageAnalysis(true);
                            else setShowMinigameModal(true);
                        }}>
                            <div className="flex items-center gap-3"><div className="bg-office-900 w-8 h-8 rounded flex items-center justify-center text-office-400"><i className="fas fa-image"></i></div> Analisis Gambar</div>
                            {!isImageAnalysisUnlocked && <i className="fas fa-lock text-office-500 text-sm"></i>}
                        </button>
                    )}
                    {currentDoc.type === POOL_TYPES.LINK && (
                        <button className="w-full text-left px-4 py-3 bg-office-800/40 hover:bg-office-700/60 border border-office-700/50 rounded-lg transition-colors text-office-200 font-medium flex justify-between items-center" onClick={() => {
                            if (isLinkAnalysisUnlocked) setShowLinkAnalysis(true);
                            else setShowSpaceShooter(true);
                        }}>
                            <div className="flex items-center gap-3"><div className="bg-office-900 w-8 h-8 rounded flex items-center justify-center text-office-400"><i className="fas fa-globe"></i></div> Sandbox Link</div>
                            {!isLinkAnalysisUnlocked && <i className="fas fa-lock text-office-500 text-sm"></i>}
                        </button>
                    )}
                    {currentDoc.type === POOL_TYPES.FILE && (
                        <button className="w-full text-left px-4 py-3 bg-office-800/40 hover:bg-office-700/60 border border-office-700/50 rounded-lg transition-colors text-office-200 font-medium flex justify-between items-center" onClick={() => {
                            setShowNumberMemory(true);
                        }}>
                            <div className="flex items-center gap-3">
                                <div className="bg-office-900 w-8 h-8 rounded flex items-center justify-center text-office-400"><i className={`fas ${unlockedFileScan ? 'fa-check-circle text-green-500' : 'fa-shield'}`}></i></div>
                                {unlockedFileScan ? 'Lihat Hasil Pindai' : 'Scan Attachment'}
                            </div>
                            {!unlockedFileScan && <i className="fas fa-lock text-office-500 text-sm"></i>}
                        </button>
                    )}
                </div>

                <div className="flex flex-col gap-3 border-t border-office-800 pt-6">
                    <button className="w-full py-4 border border-green-500 text-green-400 font-bold rounded-lg hover:bg-green-500/20 transition-all flex justify-center items-center gap-2 hover:shadow-[0_0_15px_rgba(34,197,94,0.3)]" onClick={() => makeDecision('Aman')}>
                        <i className="fas fa-check-circle"></i> Aman
                    </button>
                    <button className="w-full py-4 border border-red-500 text-red-400 font-bold rounded-lg hover:bg-red-500/20 transition-all flex justify-center items-center gap-2 shadow-[0_0_10px_rgba(239,68,68,0.2)] hover:shadow-[0_0_20px_rgba(239,68,68,0.4)]" onClick={() => makeDecision('Phishing')}>
                        <i className="fas fa-exclamation-triangle"></i> Phishing
                    </button>
                </div>
            </div>

            {/* Modals */}
            {showSearchEngine && <SearchEngineModal onClose={() => setShowSearchEngine(false)} />}

            {showAiModal && (
                <div className="fixed inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm z-50 p-4" onClick={() => setShowAiModal(false)}>
                    <div className="glass-panel w-full max-w-2xl max-h-[90vh] flex flex-col rounded-2xl overflow-hidden animate-[slide-up_0.3s_ease-out]" onClick={e => e.stopPropagation()}>
                        <div className="bg-office-950/80 border-b border-office-700/50 p-5 flex justify-between items-center">
                            <h2 className="text-xl font-bold text-white m-0 flex items-center gap-2"><i className="fas fa-robot text-office-400"></i> LISA</h2>
                            <button className="text-office-400 hover:text-white bg-transparent border-none text-2xl cursor-pointer p-2 rounded-full hover:bg-office-800/50 transition-colors" onClick={() => setShowAiModal(false)}><i className="fas fa-times"></i></button>
                        </div>
                        <div className="p-6 overflow-y-auto custom-scrollbar text-left text-office-100">
                            {!aiResult ? (
                                <>
                                    <p className="mb-6 text-office-200">LISA (Linguistic Intelligence & Syntax Analyzer) berfungsi mendeteksi anomali bahasa dan taktik rekayasa sosial pada teks dokumen. Modul ini maksimal digunakan 2x per sesi dan hanya menyajikan probabilitas ancaman, bukan jawaban mutlak.</p>
                                    {aiError && <div className="bg-red-900/30 border border-red-500 text-red-200 p-4 rounded-lg mb-6 whitespace-pre-wrap">{aiError}</div>}
                                    <button className="w-full px-6 py-4 bg-office-600 hover:bg-office-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold rounded-xl transition-all shadow-[0_0_15px_rgba(2,132,199,0.4)] flex justify-center items-center gap-2" onClick={handleAnalyzeAI} disabled={isAiLoading || aiUsesLeft <= 0}>
                                        {isAiLoading ? <><i className="fas fa-spinner fa-spin"></i> Menganalisis...</> : <><i className="fas fa-magic"></i> Jalankan Analisis</>}
                                    </button>
                                </>
                            ) : (
                                <div className="animate-[fade-in_0.3s_ease-out]">
                                    <h4 className="text-lg font-bold text-office-300 mb-3">Hasil Analisis:</h4>
                                    <div className="bg-office-900/60 p-5 rounded-xl border border-office-700/50 whitespace-pre-wrap leading-relaxed text-office-200 shadow-inner">{aiResult}</div>
                                    <button className="w-full mt-6 px-6 py-3 bg-office-800 hover:bg-office-700 border border-office-600 text-white font-bold rounded-xl transition-all" onClick={() => setShowAiModal(false)}>Tutup</button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {showImageAnalysis && currentDoc.type === POOL_TYPES.IMAGE && (
                <div className="fixed inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm z-50 p-4" onClick={() => setShowImageAnalysis(false)}>
                    <div className="glass-panel w-full max-w-xl max-h-[90vh] flex flex-col rounded-2xl overflow-hidden animate-[slide-up_0.3s_ease-out]" onClick={e => e.stopPropagation()}>
                        <div className="bg-office-950/80 border-b border-office-700/50 p-5 flex justify-between items-center">
                            <h2 className="text-xl font-bold text-white m-0 flex items-center gap-2"><i className="fas fa-image text-office-400"></i> Analisis Gambar</h2>
                            <button className="text-office-400 hover:text-white bg-transparent border-none text-2xl cursor-pointer p-2 rounded-full hover:bg-office-800/50 transition-colors" onClick={() => setShowImageAnalysis(false)}><i className="fas fa-times"></i></button>
                        </div>
                        <div className="p-6 overflow-y-auto custom-scrollbar">
                            <ul className="space-y-4 text-office-200 text-base">
                                <li className="flex flex-col"><span className="text-sm text-office-400 font-bold uppercase tracking-wider">File Name</span> <span className="font-mono mt-1 text-office-100">{currentDoc.imageMetadata.fileName}</span></li>
                                <li className="flex flex-col"><span className="text-sm text-office-400 font-bold uppercase tracking-wider">Dimensions</span> <span className="font-mono mt-1 text-office-100">{currentDoc.imageMetadata.dimensions}</span></li>
                                <li className="flex flex-col"><span className="text-sm text-office-400 font-bold uppercase tracking-wider">Pixel Anomaly</span> <span className={`font-mono mt-1 font-bold ${parseFloat(currentDoc.imageMetadata.pixelAnomaly) > 10 ? 'text-red-400' : 'text-green-400'}`}>{currentDoc.imageMetadata.pixelAnomaly}</span></li>
                                <li className="flex flex-col"><span className="text-sm text-office-400 font-bold uppercase tracking-wider">Hidden Layer</span> <span className="font-mono mt-1 text-office-100">{currentDoc.imageMetadata.hiddenLayer}</span></li>
                            </ul>
                        </div>
                    </div>
                </div>
            )}

            {showLinkAnalysis && currentDoc.type === POOL_TYPES.LINK && (
                <div className="fixed inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm z-50 p-4" onClick={() => setShowLinkAnalysis(false)}>
                    <div className="glass-panel w-full max-w-xl max-h-[90vh] flex flex-col rounded-2xl overflow-hidden animate-[slide-up_0.3s_ease-out]" onClick={e => e.stopPropagation()}>
                        <div className="bg-office-950/80 border-b border-office-700/50 p-5 flex justify-between items-center">
                            <h2 className="text-xl font-bold text-white m-0 flex items-center gap-2"><i className="fas fa-globe text-office-400"></i> Sandbox Link</h2>
                            <button className="text-office-400 hover:text-white bg-transparent border-none text-2xl cursor-pointer p-2 rounded-full hover:bg-office-800/50 transition-colors" onClick={() => setShowLinkAnalysis(false)}><i className="fas fa-times"></i></button>
                        </div>
                        <div className="p-6 overflow-y-auto custom-scrollbar">
                            <ul className="space-y-4 text-office-200 text-base">
                                <li className="flex flex-col"><span className="text-sm text-office-400 font-bold uppercase tracking-wider flex items-center gap-2">Redirect Chain <i className="fas fa-question-circle text-xs cursor-help" title="Jalur perpindahan alamat web sebelum mencapai tujuan akhir."></i></span> <span className="font-mono mt-1 text-office-100">{currentDoc.sandboxData.redirectChain}</span></li>
                                <li className="flex flex-col"><span className="text-sm text-office-400 font-bold uppercase tracking-wider flex items-center gap-2">SSL Certificate <i className="fas fa-question-circle text-xs cursor-help" title="Sertifikat keamanan web (HTTPS). Valid berarti data dienkripsi, namun BUKAN jaminan situs tersebut bukan milik penipu."></i></span> <span className={`font-mono mt-1 font-bold ${currentDoc.sandboxData.sslValid ? 'text-green-400' : 'text-red-400'}`}>{currentDoc.sandboxData.sslValid ? 'Valid' : 'Invalid'}</span></li>
                                <li className="flex flex-col"><span className="text-sm text-office-400 font-bold uppercase tracking-wider flex items-center gap-2">Domain Age <i className="fas fa-question-circle text-xs cursor-help" title="Usia pendaftaran domain. Situs phishing biasanya menggunakan domain yang baru dibuat."></i></span> <span className="font-mono mt-1 text-office-100">{currentDoc.sandboxData.domainAge}</span></li>
                                <li className="flex flex-col"><span className="text-sm text-office-400 font-bold uppercase tracking-wider flex items-center gap-2">Form Fields <i className="fas fa-question-circle text-xs cursor-help" title="Kolom isian pada situs. Situs mencurigakan sering kali meminta kredensial sensitif."></i></span> <span className="font-mono mt-1 text-office-100">{currentDoc.sandboxData.formFields}</span></li>
                            </ul>
                        </div>
                    </div>
                </div>
            )}

            {showMinigameModal && (
                <MinigameModal
                    onSuccess={() => {
                        setIsImageAnalysisUnlocked(true);
                        setShowMinigameModal(false);
                        setShowImageAnalysis(true);
                    }}
                    onFail={() => {
                        setShowMinigameModal(false);
                    }}
                    onClose={() => setShowMinigameModal(false)}
                />
            )}

            {showSpaceShooter && (
                <SpaceShooterModal
                    onSuccess={() => {
                        setIsLinkAnalysisUnlocked(true);
                        setShowSpaceShooter(false);
                        setShowLinkAnalysis(true);
                    }}
                    onFail={() => {
                        setShowSpaceShooter(false);
                    }}
                    onClose={() => setShowSpaceShooter(false)}
                />
            )}

            {showNumberMemory && (
                <NumberMemoryModal
                    document={currentDoc}
                    startAtResult={unlockedFileScan}
                    onSuccess={() => {
                        setShowNumberMemory(false);
                        setUnlockedFileScan(true);
                    }}
                    onFail={() => {
                        // User requested to be able to replay, so we just close the modal
                        // and they can click "Scan Attachment" again.
                        setShowNumberMemory(false);
                    }}
                />
            )}
        </div>
    );
};

// 3. Evaluation
const Evaluation = () => {
    const { playerResults, resetGame, startGame } = useGame();
    const [evalScreen, setEvalScreen] = useState(1);

    const totalErrors = playerResults.filter(r => !r.isCorrect).length;
    const falsePositives = playerResults.filter(r => r.isFalsePositive).length;
    const falseNegatives = playerResults.filter(r => r.isFalseNegative);

    const breachedDoc = falseNegatives.length > 0 ? falseNegatives[0].document : null;
    let breachedName = "", breachedDiv = "";
    if (breachedDoc && breachedDoc.forwarder) {
        const parts = breachedDoc.forwarder.split(' - ');
        breachedName = parts[0] || "Seorang rekan";
        breachedDiv = parts[1] || "Divisi Internal";
    }

    let narrative = "";
    if (totalErrors === 0) narrative = "Tidak ada insiden minggu ini. Laporan bersih. Seluruh staf perusahaan mengucapkan terima kasih karena telah menjaga alur komunikasi divisi mereka tetap aman.";
    else if (totalErrors === 1 && falsePositives === 1) narrative = "Salah satu rekanmu sempat memprotes karena dokumen kerja penting mereka tertahan oleh sistem keamanan. Pekerjaan di divisi mereka sedikit terhambat, tapi mereka mengerti niatmu baik. Tidak ada kerusakan fatal.";
    else if (totalErrors === 1 && falseNegatives.length === 1) narrative = `Sistem mendeteksi anomali keamanan kritis. Dokumen manipulatif yang Anda loloskan telah memakan korban. Kredensial, dana, atau perangkat milik ${breachedName} dari ${breachedDiv} telah diretas karena insiden ini.`;
    else if (totalErrors === 2) narrative = "Laporan insiden bulan ini mencantumkan nama Anda dua kali. Tim IT pusat sedang mengisolasi jaringan di berbagai divisi yang terdampak. Manajer memintamu untuk menghadap ke ruangannya sekarang.";
    else if (totalErrors >= 3) narrative = "Server down sejak pukul 03.00. Data sensitif perusahaan terekspos sepenuhnya karena celah besar dari berbagai divisi. Besok pagi ada surat di meja Anda - bukan surat penghargaan.";

    let title = "", titleDesc = "";
    if (totalErrors === 0) { title = "Cyber Sentinel"; titleDesc = "Anda tidak meloloskan satu celah pun"; }
    else if (totalErrors === 1 && falsePositives === 1) { title = "Cautious Analyst"; titleDesc = "Terlalu hati-hati kadang merugikan, tapi niatnya tepat"; }
    else if (totalErrors === 1 && falseNegatives.length === 1) { title = "Almost There"; titleDesc = "Satu lubang sudah cukup untuk kapal bocor"; }
    else if (totalErrors === 2) { title = "Security Liability"; titleDesc = "Perusahaan mencatat dua insiden ini"; }
    else if (totalErrors >= 3) { title = "You're Fired"; titleDesc = "... tolong kembalikan kartu akses Anda"; }

    return (
        <div className="flex items-center justify-center min-h-screen relative z-10 w-full p-4 md:p-8">
            <div className="w-full max-w-4xl animate-[fade-in_0.5s_ease-out]">

                {evalScreen === 1 && (
                    <div className="animate-[fade-in_0.5s_ease-out]">
                        <h2 className="text-3xl md:text-4xl font-extrabold text-center text-office-200 mb-8 tracking-wide drop-shadow-md">Debrief Laporan Sesi</h2>
                        <div className="flex flex-col gap-6">
                            {playerResults.map((result, idx) => (
                                <div key={idx} className={`glass-panel p-6 rounded-xl animate-[slide-up_0.5s_ease-out] border-l-4 ${result.isCorrect ? 'border-green-500 bg-green-900/10' : 'border-red-500 bg-red-900/10'}`} style={{ animationDelay: `${idx * 0.1}s` }}>
                                    <div className="flex justify-between items-center mb-4 border-b border-office-700/30 pb-3">
                                        <h3 className="text-xl font-bold text-white m-0">Dokumen {idx + 1}</h3>
                                        <div className={`px-4 py-1 rounded-full font-bold text-sm tracking-widest ${result.isCorrect ? 'bg-green-500/20 text-green-400 border border-green-500/50' : 'bg-red-500/20 text-red-400 border border-red-500/50'}`}>{result.isCorrect ? 'BENAR' : 'SALAH'}</div>
                                    </div>
                                    <p className="text-office-200 mb-2"><strong>Pengirim:</strong> <span className="text-white">{result.document.sender}</span></p>
                                    <p className="text-office-200 mb-2"><strong>Status Asli:</strong> <span className="text-white font-medium">{result.document.isPhishing ? 'Phishing' : 'Aman'}</span></p>
                                    <p className="text-office-200 mb-4"><strong>Keputusan Anda:</strong> <span className="text-white font-bold">{result.decision}</span></p>
                                    {!result.isCorrect && (
                                        <div className="mt-2 p-4 bg-red-950/50 border border-red-500/30 rounded-lg text-red-300 font-medium flex gap-3 shadow-inner">
                                            <i className="fas fa-exclamation-circle mt-1 text-red-500"></i>
                                            <span>{result.isFalsePositive ? 'Anda memblokir dokumen yang aman (False Positive).' : 'Anda meloloskan ancaman phishing (False Negative).'}</span>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                        <div className="text-center mt-10">
                            <button className="px-8 py-4 bg-office-600 hover:bg-office-500 text-white font-bold rounded-xl shadow-[0_0_15px_rgba(2,132,199,0.5)] hover:shadow-[0_0_25px_rgba(56,189,248,0.7)] hover:-translate-y-1 transition-all flex items-center gap-3 mx-auto" onClick={() => setEvalScreen(2)}>
                                Lanjutkan <i className="fas fa-arrow-right"></i>
                            </button>
                        </div>
                    </div>
                )}

                {evalScreen === 2 && (
                    <div className="glass-panel text-center p-8 md:p-16 rounded-2xl animate-[slide-up_0.5s_ease-out]">
                        <h2 className="text-2xl md:text-3xl font-bold text-office-300 mb-8 tracking-wide">Dampak Keputusan</h2>
                        <p className="text-xl md:text-2xl leading-relaxed italic text-office-100 font-medium border-l-4 border-office-500 pl-6 text-left bg-office-900/40 py-4 pr-4 rounded-r-lg shadow-inner">"{narrative}"</p>
                        <div className="mt-12 flex justify-center">
                            <button className="px-8 py-4 bg-office-600 hover:bg-office-500 text-white font-bold rounded-xl shadow-[0_0_15px_rgba(2,132,199,0.5)] hover:shadow-[0_0_25px_rgba(56,189,248,0.7)] hover:-translate-y-1 transition-all flex items-center gap-3" onClick={() => setEvalScreen(3)}>
                                Lihat Hasil Akhir <i className="fas fa-arrow-right"></i>
                            </button>
                        </div>
                    </div>
                )}

                {evalScreen === 3 && (
                    <div className="animate-[slide-up_0.5s_ease-out] text-center flex flex-col items-center">
                        <div className="glass-panel p-8 md:p-16 rounded-3xl inline-block shadow-[0_0_30px_rgba(14,165,233,0.3)] border-2 border-office-500/50 relative overflow-hidden w-full max-w-2xl">
                            <div className="absolute inset-0 bg-office-500/10 blur-xl"></div>
                            <div className="relative z-10">
                                <h3 className="text-office-300 font-bold tracking-[0.3em] uppercase text-sm mb-4">Gelar Anda</h3>
                                <h1 className="text-5xl md:text-7xl font-extrabold text-white my-6 drop-shadow-[0_0_20px_rgba(56,189,248,0.8)] leading-tight">{title}</h1>
                                <p className="text-xl text-office-200 mt-6 max-w-md mx-auto">{titleDesc}</p>
                            </div>
                        </div>
                        <div className="flex flex-col md:flex-row gap-4 justify-center w-full max-w-lg mt-10">
                            <button className="flex-1 py-4 bg-office-600 hover:bg-office-500 text-white font-bold rounded-xl shadow-[0_0_15px_rgba(2,132,199,0.5)] hover:shadow-[0_0_25px_rgba(56,189,248,0.7)] hover:-translate-y-1 transition-all flex items-center justify-center gap-3" onClick={startGame}>
                                <i className="fas fa-redo"></i> Coba Lagi
                            </button>
                            <button className="flex-1 py-4 bg-transparent border-2 border-office-600 hover:bg-office-600/30 text-office-200 font-bold rounded-xl transition-all flex items-center justify-center gap-3" onClick={resetGame}>
                                <i className="fas fa-home"></i> Menu Utama
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

// --- MAIN APP ---
const AppContent = () => {
    const { currentPhase } = useGame();
    return (
        <>
            {/* Mobile Blocking Overlay */}
            <div className="fixed inset-0 z-[9999] bg-office-950 flex flex-col items-center justify-center p-6 text-center md:hidden">
                <div className="max-w-md w-full bg-office-900/80 backdrop-blur-md border border-office-700/50 rounded-2xl p-8 shadow-2xl">
                    <i className="fa-solid fa-mobile-screen-button text-6xl text-red-500 mb-6 animate-pulse"></i>
                    <h2 className="text-2xl font-bold text-office-100 mb-4">Perangkat Tidak Kompatibel</h2>
                    <p className="text-office-300 leading-relaxed">
                        Situs ini memerlukan antarmuka Desktop/PC untuk mendapatkan pengalaman bermain yang maksimal. Silakan akses situs ini melalui komputer atau laptop.
                    </p>
                </div>
            </div>

            {/* Main Application Container */}
            <div className="w-full min-h-screen overflow-hidden hidden md:block">
                {currentPhase === GAME_PHASES.MENU && <MainMenu />}
                {currentPhase === GAME_PHASES.WORKSPACE && <Workspace />}
                {currentPhase === GAME_PHASES.EVALUATION && <Evaluation />}
            </div>
        </>
    );
};

const App = () => (
    <GameProvider>
        <AppContent />
    </GameProvider>
);

export default App;
