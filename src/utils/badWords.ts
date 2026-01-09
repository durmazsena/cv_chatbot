// En sık kullanılan küfür, kısaltma ve hakaret kökleri
export const BAD_WORD_ROOTS = [
    // Kısaltmalar (En sık kullanılanlar)
    "amk", "aq", "amq", "a.q", "a.m.k", "oc", "oç", "o.ç",

    // Ağır Küfür Kökleri (Bunlar ek alsa da engellenmeli)
    "siktir", "sıktr", "yarrak", "yarak", "orospu", "orosbu",
    "kahpe", "kaltak", "sürtük", "yavşak", "yavsak", "piç", "pic",
    "sikik", "götveren", "gotveren", "gavat", "ibne", "ipne",

    // Hakaretler (Daha hafif ama profesyonel olmayanlar)
    "gerizekalı", "gerızekalı", "salak", "aptal", "ahmak",
    "mal", "beyinsiz", "dangalak", "hıyar", "denyo"
];

// Yanlış pozitif (False Positive) verebilecek riskli kısa kelimeler
// Bunları SADECE tek başına kullanıldığında engellemek daha güvenlidir.
export const RISKY_EXACT_MATCHES = [
    "am", "göt", "got", "mem", "meme"
];
