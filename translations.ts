export const translations = {
  // App.tsx
  title: { en: 'UPN to EPC QR Converter', sl: 'Pretvornik UPN v EPC QR' },
  description: { en: "Scan a Slovenian UPN bill's QR code to convert it into a standard EPC QR code, perfect for payment apps like Revolut.", sl: 'Skenirajte QR kodo s slovenskega UPN obrazca in jo pretvorite v standardno EPC QR kodo, idealno za plačilne aplikacije, kot je Revolut.' },
  startScanning: { en: 'Start Scanning', sl: 'Začni Skeniranje' },
  uploadImage: { en: 'Upload Image', sl: 'Naloži Sliko' },
  footerText: { en: 'UPN to EPC Converter. Built for simplicity.', sl: 'Pretvornik UPN v EPC. Narejeno za enostavnost.' },
  
  // Error messages
  errorTitle: { en: 'An Error Occurred', sl: 'Prišlo je do Napake' },
  errorTryAgain: { en: 'Try Again', sl: 'Poskusi Znova' },
  errorCamera: { en: 'Camera error:', sl: 'Napaka kamere:'},
  errorFileUpload: { en: 'File Upload Error:', sl: 'Napaka pri nalaganju datoteke:'},
  errorDecode: {en: 'Could not decode QR code from the selected image.', sl: 'QR kode iz izbrane slike ni bilo mogoče dekodirati.'},
  errorEmptyScan: { en: 'Scan failed: The QR code is empty or could not be read.', sl: 'Skeniranje ni uspelo: QR koda je prazna ali je ni mogoče prebrati.' },
  scanTipsTitle: { en: 'Tips for a better scan:', sl: 'Nasveti za boljše skeniranje:' },
  scanTips: { en: 'Ensure the QR code is fully visible and in focus.\nMake sure there is good, even lighting without glare.\nHold your device steady and center the code in the scanner frame.\nIf uploading a file, use a clear, high-resolution image.', sl: 'Prepričajte se, da je QR koda v celoti vidna in izostrena.\nPoskrbite za dobro, enakomerno osvetlitev brez bleščanja.\nDržite napravo mirno in postavite kodo na sredino okvirja skenerja.\nČe nalagate datoteko, uporabite jasno sliko visoke ločljivosti.' },
  rawContentTitle: { en: 'Raw Scanned Content', sl: 'Surova Vsebina Skeniranja' },
  errorUnknown: { en: 'An unknown error occurred during parsing.', sl: 'Med razčlenjevanjem je prišlo do neznane napake.' },
  errorInvalidSharedLink: { en: 'The shared link is invalid or corrupted.', sl: 'Deljena povezava je neveljavna ali poškodovana.' },


  // Error keys from conversionService
  ERROR_INVALID_FORMAT: { 
    en: (lines: number) => `Invalid UPN QR format. Expected at least 20 lines starting with UPNQR, but found ${lines}.`, 
    sl: (lines: number) => `Neveljavna UPN QR oblika. Pričakovanih je bilo vsaj 20 vrstic, ki se začnejo z UPNQR, najdenih pa ${lines}.`
  },
  ERROR_MISSING_DATA: { en: 'Missing essential data for EPC conversion (Recipient Name, IBAN, or Amount).', sl: 'Manjkajo bistveni podatki za pretvorbo v EPC (ime prejemnika, IBAN ali znesek).'},
  ERROR_INVALID_AMOUNT: { en: 'Invalid amount format in UPN data.', sl: 'Neveljavna oblika zneska v podatkih UPN.'},

  // Scanner.tsx
  scannerCancel: { en: 'Cancel scanning', sl: 'Prekliči skeniranje'},
  flashlightToggle: { en: 'Toggle flashlight', sl: 'Preklopi svetilko'},
  flashlightOn: { en: 'Flashlight on', sl: 'Svetilka vklopljena'},
  flashlightOff: { en: 'Flashlight off', sl: 'Svetilka izklopljena'},
  
  // ResultDisplay.tsx
  resultTitle: { en: 'Conversion Successful!', sl: 'Pretvorba Uspešna!' },
  resultDescription: { en: 'Scan the EPC QR code below with your banking app.', sl: 'Skenirajte spodnjo EPC QR kodo s svojo bančno aplikacijo.'},
  originalDataTitle: { en: 'Original UPN Data', sl: 'Izvirni UPN Podatki'},
  recipient: { en: 'Recipient', sl: 'Prejemnik' },
  iban: { en: 'IBAN', sl: 'IBAN' },
  amount: { en: 'Amount', sl: 'Znesek' },
  purpose: { en: 'Purpose', sl: 'Namen' },
  reference: { en: 'Reference', sl: 'Referenca' },
  scanAnother: { en: 'Scan Another Code', sl: 'Skeniraj Drugo Kodo' },
  howToPayTitle: { en: 'How to Pay', sl: 'Kako plačati' },
  howToPayStep1: { en: 'Use "Download QR" or "Share QR Image" to transfer the code to another device (e.g., a computer).', sl: 'Uporabite "Prenesi QR" ali "Deli Sliko QR", da prenesete kodo na drugo napravo (npr. na računalnik).'},
  howToPayStep2: { en: 'Open the QR code image on the other device\'s screen.', sl: 'Odprite sliko QR kode na zaslonu druge naprave.'},
  howToPayStep3: { en: 'Scan the code from the screen with your banking app (e.g., Revolut).', sl: 'Skenirajte kodo z zaslona s svojo bančno aplikacijo (npr. Revolut).'},
  downloadImage: { en: 'Download QR', sl: 'Prenesi QR' },
  shareImage: { en: 'Share QR Image', sl: 'Deli Sliko QR' },
  shareImageNotSupported: { en: 'Image sharing is not supported in this browser.', sl: 'Deljenje slik v tem brskalniku ni podprto.' },
  copyEpcPayload: { en: 'Copy Raw EPC', sl: 'Kopiraj Surovi EPC' },
  epcPayloadCopied: { en: 'EPC Copied!', sl: 'EPC Kopiran!' },
  copyEpcFailAlert: { en: 'Could not copy EPC payload.', sl: 'EPC vsebine ni bilo mogoče kopirati.'},
  shareTitle: { en: 'UPN Payment QR Code', sl: 'UPN plačilna QR koda' },
  shareText: { en: 'Here is the EPC QR code image for my UPN bill payment.', sl: 'Tukaj je slika EPC QR kode za plačilo mojega UPN računa.'},

  // App.tsx shared view
  sharedTitle: { en: 'EPC QR Code Ready', sl: 'EPC QR Koda Pripravljena'},
  sharedDescription: { en: 'Scan this code with your banking app to complete the payment.', sl: 'Skenirajte to kodo s svojo bančno aplikacijo za dokončanje plačila.'},
  createYourOwn: { en: 'Create your own QR Code', sl: 'Ustvari svojo QR kodo'},
  
  // InfoModal.tsx
  infoTitle: { en: 'About This App', sl: 'O Aplikaciji' },
  infoWhatItDoes: { en: 'What it does', sl: 'Kaj aplikacija počne' },
  infoWhatItDoesText: { en: 'This tool converts a Slovenian Universal Payment Order (UPN) QR code into a European Payments Council (EPC) QR code. This makes it possible to pay Slovenian bills using modern European banking apps like Revolut, which do not natively support the UPN format.', sl: 'To orodje pretvori QR kodo slovenskega Univerzalnega plačilnega naloga (UPN) v QR kodo Evropskega plačilnega sveta (EPC). To omogoča plačevanje slovenskih računov z modernimi evropskimi bančnimi aplikacijami, kot je Revolut, ki izvorno ne podpirajo formata UPN.' },
  infoHowToUse: { en: 'How to use', sl: 'Kako uporabljati' },
  infoStep1: { en: 'Scan or upload the UPN QR code from your bill.', sl: 'Skenirajte ali naložite UPN QR kodo s svojega računa.' },
  infoStep2: { en: 'The app will instantly generate a new, standard EPC QR code.', sl: 'Aplikacija bo takoj ustvarila novo, standardno EPC QR kodo.'},
  infoStep3: { en: 'Open your banking app (e.g., Revolut), choose the option to pay via QR code, and scan the newly generated code from your screen.', sl: 'Odprite svojo bančno aplikacijo (npr. Revolut), izberite možnost plačila s QR kodo in skenirajte novo ustvarjeno kodo z zaslona.' },
  infoPrivacy: { en: 'Privacy', sl: 'Zasebnost'},
  infoPrivacyText: { en: 'This application processes everything directly in your browser. No data from your QR code is ever sent to a server. Your financial information stays on your device.', sl: 'Ta aplikacija vse obdela neposredno v vašem brskalniku. Nobeni podatki iz vaše QR kode se nikoli ne pošljejo na strežnik. Vaši finančni podatki ostanejo na vaši napravi.'},
  infoClose: { en: 'Close', sl: 'Zapri' },

  // Blog.tsx
  blogButtonTitle: { en: 'Read Article', sl: 'Preberi Članek'},
  blogTitle: { en: 'The UPN vs. EPC Challenge', sl: 'Izziv UPN proti EPC'},
  blogIntro: { en: 'Neobanks like Revolut have taken Slovenia by storm, offering a modern, low-cost alternative to traditional banking. But many new users hit the same frustrating wall: you open the app, find the QR scanner, point it at a Slovenian UPN bill... and it fails. The feature is there, but it doesn\'t recognize the code. Why does this happen, and what\'s the simple fix?', sl: 'Neobanke, kot je Revolut, so v Sloveniji doživele izjemen razmah, saj ponujajo sodobno in poceni alternativo tradicionalnemu bančništvu. Vendar se mnogi novi uporabniki soočijo z isto frustracijo: odprete aplikacijo, poiščete skener QR kod, ga usmerite v slovensko UPN položnico ... in ne deluje. Funkcija obstaja, vendar ne prepozna kode. Zakaj se to dogaja in kakšna je preprosta rešitev?' },
  blogSection1Title: { en: 'The Problem: Two Different QR Codes', sl: 'Problem: Dva Različna Standarda' },
  blogSection1P1: { en: 'The issue boils down to two different standards. Slovenian bills use the local UPN (Univerzalni Plačilni Nalog) QR code format. Neobanks like Revolut and N26, however, operate across the entire SEPA region and their scanners are built exclusively for the international EPC (European Payments Council) standard. Your banking app sees a UPN code, doesn\'t understand the format, and gives up.', sl: 'Težava izvira iz dveh različnih standardov. Slovenske položnice uporabljajo lokalni format QR kode UPN (Univerzalni Plačilni Nalog). Neobanke, kot sta Revolut in N26, pa delujejo na celotnem območju SEPA in so njihovi skenerji narejeni izključno za mednarodni standard EPC (European Payments Council). Vaša bančna aplikacija vidi UPN kodo, ne razume formata in zato javi napako.' },
  blogSection2Title: { en: 'Why Are Neobanks So Popular Anyway?', sl: 'Zakaj so neobanke sploh tako priljubljene?'},
  blogSection2P1: { en: 'The switch to neobanks is driven by clear benefits. Financial savings are the biggest draw: while Slovenian banks typically charge €0.30 or more per bill, SEPA payments on Revolut are free. They also offer superior currency exchange rates. Security is enhanced through features like single-use virtual cards for safe online shopping. They are legitimate banks, with Revolut being fully licensed in the EU and offering deposit insurance up to €100,000. This combination of no fees, advanced features, and security makes them a compelling choice for daily banking and even for sole proprietors looking to cut costs.', sl: 'Prehod na neobanke spodbujajo očitne prednosti. Finančni prihranki so največji razlog: medtem ko slovenske banke običajno zaračunajo 0,30 € ali več na položnico, so SEPA plačila na Revolutu brezplačna. Ponujajo tudi ugodnejše menjalne tečaje. Varnost je izboljšana s funkcijami, kot so virtualne kartice za enkratno uporabo za varno spletno nakupovanje. Gre za legitimne banke, saj ima Revolut polno licenco v EU in ponuja jamstvo za vloge do 100.000 €. Ta kombinacija brez provizij, naprednih funkcij in varnosti jih postavlja v vlogo prepričljive izbire za vsakodnevno bančništvo in celo za samostojne podjetnike, ki želijo znižati stroške.' },
  blogSection3Title: { en: 'The Solution: The Missing Piece', sl: 'Rešitev: Manjkajoči Delček'},
  blogSection3P1: { en: 'This converter is the missing piece of the puzzle. It acts as a simple but powerful translator: you scan the incompatible Slovenian UPN code, and the app instantly generates a new, fully compatible EPC code. This new code can then be scanned by a range of modern banking apps to complete your payment, fee-free. It’s the bridge that unlocks all the cost-saving benefits of neobanking for your everyday Slovenian bills.', sl: 'Ta pretvornik je manjkajoči del sestavljanke. Deluje kot preprost, a zmogljiv prevajalnik: skenirate nezdružljivo slovensko UPN kodo, aplikacija pa takoj ustvari novo, popolnoma združljivo EPC kodo. To novo kodo lahko nato skenirate z vrsto sodobnih bančnih aplikacij za dokončanje plačila – brez provizije. Je most, ki vam omogoča, da izkoristite vse prednosti sodobnega bančništva za plačevanje vaših vsakdanjih slovenskih položnic.' },
  blogSection4Title: { en: 'Which Neobanks Are Compatible?', sl: 'Katere neobanke so združljive?' },
  blogSection4P1: { en: 'While many modern European banks support EPC QR codes, this tool is confirmed to work perfectly with several major neobanks popular in Slovenia, including:', sl: 'Medtem ko mnoge sodobne evropske banke podpirajo EPC QR kode, je potrjeno, da to orodje odlično deluje z večjimi neobankami, priljubljenimi v Sloveniji, vključno z:' },
  blogSection4List: { en: 'Revolut\nN26\nBunq\nVivid Money', sl: 'Revolut\nN26\nBunq\nVivid Money' },
  blogSection4P2: { en: 'This list is not exhaustive, and other SEPA-compliant banking apps may also work. The key is that their QR scanner supports the EPC standard.', sl: 'Ta seznam ni dokončen in morda bodo delovale tudi druge bančne aplikacije, skladne s SEPA. Ključno je, da njihov skener QR kod podpira standard EPC.' },
  blogBackToApp: { en: 'Back to App', sl: 'Nazaj na Aplikacijo'},
  
  // ImageCropModal.tsx
  cropTitle: { en: 'Crop QR Code', sl: 'Obreži QR Kodo'},
  cropDescription: { en: 'Adjust the selection to fit the QR code tightly, then press "Scan Cropped Area".', sl: 'Prilagodite izbiro, da se tesno prilega QR kodi, nato pritisnite "Skeniraj Obrezano Področje".'},
  cropCancel: { en: 'Cancel', sl: 'Prekliči'},
  cropConfirm: { en: 'Scan Cropped Area', sl: 'Skeniraj Obrezano'},
};