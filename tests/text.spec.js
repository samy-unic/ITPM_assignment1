const { test } = require('@playwright/test');
const { time } = require('node:console');

const colors = {
  green: (text) => `\x1b[32m${text}\x1b[0m`,
  red: (text) => `\x1b[31m${text}\x1b[0m`,
};

// Helper: type word by word with space
async function typeWithSpaces(textarea, sentence) {
  const words = sentence.split(' ');
  for (const word of words) {
    await textarea.type(word + ' ', { delay: 500 }); // small delay helps AI process
  }
}

test('Tamil Transliteration - Sequential Tests', async ({ page }) => {
  test.setTimeout(600000);
  await page.goto('https://tamil.changathi.com/');
  const textarea = page.locator('#transliterateTextarea');

  const tests = [
    // positive // 
  { input: 'Neenga enga poringa', expected: 'நீங்க எங்க போறீங்க ' },
  { input: 'Ippa Neram enna', expected: 'இப்ப நேரம் என்ன ' },
  { input: 'Vanthuten veetukku', expected: 'வந்துட்டேன் வீட்டுக்கு ' },
  { input: 'Inga udkaarnthu pesalam', expected: 'இங்க உட்க்கார்ந்து பேசலாம் ' },
  { input: 'Avar elloridamum natpaka irupar', expected: 'அவர் எல்லோரிடமும் நட்பாக இருப்பார் ' },
  { input: 'Naalaiku oivu edukuren', expected: 'நாளைக்கு ஓய்வு எடுக்குறேன் ' },
  { input: 'Konjam uthavi pannunga', expected: 'கொஞ்சம் உதவி பண்ணுங்க ' },
  { input: 'Nee sapitiya illaya', expected: 'நீ சாப்பிட்டியா இல்லையா ' },

  { input: 'Innaiku kuttam iruku athanala thamatham aagum',
    expected: 'இன்னைக்கு கூட்டம் இருக்கு அதனால தாமதம் ஆகும் ' },

  { input: 'perunthu satu munathaka sentru vittathu',
    expected: 'பேருந்து சற்று முன்னதாக சென்று விட்டது ' },

  { input: 'seyarthita velai mikavum mukkiyam athai viraivaka mudikanum',
    expected: 'செயற்திட்ட வேலை மிகவும் முக்கியம் அதை விரைவாக முடிக்கணும் ' },

  { input: 'vidumurai nadkalai kudumbaththoda neram selavidalam',
    expected: 'விடுமுறை நாட்களை குடும்பத்தோட நேரம் செலவிடலாம் ' },

  { input: 'asiriyar sonnatha nallaa purinjukitten',
    expected: 'ஆசிரியர் சொன்னதை நல்லா புரிஞ்சுக்கிட்டேன் ' },

  { input: 'tholaipesi katanam mudinjiduchu',
    expected: 'தொலைபேசி கட்டணம் முடிஞ்சிடுச்சு ' },

  { input: 'mazai peyyudhu kudai eduthuko',
    expected: 'மழை பெய்யுது குடை எடுத்துக்கோ ' },

  { input: 'Nee sonna thitam nalla yosanai',
    expected: 'நீ சொன்ன திட்டம் நல்ல யோசனை ' },

  { input: 'aluvalaka velai mikavum athikamaka iruku',
    expected: 'அலுவலக வேலை மிகவும் அதிகமாக இருக்கு ' },

  { input: 'vahupu mudinjadhum maithanam pogalam',
    expected: 'வகுப்பு முடிஞ்சதும் மைதானம் போகலாம் ' },

  { input: 'Enakku Tamil mikavum pidikkum',
    expected: 'எனக்கு தமிழ் மிகவும் பிடிக்கும் ' },

  { input: 'nulakaththula amaithiyaa irukanum',
    expected: 'நுலகத்துல அமைதியா இருக்கனும் ' },

  { input: 'nanbanoda piranthanal innaiku',
    expected: 'நண்பனோட பிறந்தநாள் இன்னைக்கு ' },

  { input: 'Naama ellarum serndhu jeyichchom',
    expected: 'நாம எல்லாரும் சேர்ந்து ஜெயிச்சோம் ' },

  {
    input: 'Intha thitam  veti adajanum entral kuluvaka ininthu velai seiya vendum. Ellarum kathachchu seithaa thaan velai ilakuvaha seijalam. apadi seithaal thaan nalla peruperu kidaikkum. ',
    expected: 'இந்த திட்டம் வெற்றி அடையனும் என்றால் குழுவாக இனைந்து வேலை செய்ய வேண்டும். எல்லாரும் கதைச்சு செய்தா தான் வேலை இலகுவாக செய்யலாம். அப்படி செய்தால் தான் நல்ல பெறுபேறு கிடைக்கும். '},
  {
  input: 'Avan nallaavan endru ellaarum solluvaanga. Yaarukku enna pirachanai endraalum udane udhavi seivaan. Ellaarukkum mikavum uthaviyaga iruppaan. Yaarukkum thiyathu ninaikka maattaan. Ippadi irukkum manithargal romba kuraivaaga aaga irukkaanga. ',
  expected: 'அவன் நல்லவன் என்று எல்லாரும் சொல்லுவாங்க யாருக்கு என்ன  பிரச்சனை என்றாலும் உடனே உதவி செய்வான். எல்லாருக்கும் மிக உதவியாக இருப்பான். யாருக்கும் தியது நினைக்க மாட்டான். இப்படி இருக்கும் மனிதர்கள் ரொம்ப குறைவாக ஆக இருக்காங்க. '
  },

  // negative //
  
  { input: 'Nee entha school', expected: 'நீ எந்த பாடசாலை ' },
  { input: 'saptiyasaptiyasaptiya', expected: 'Incorrect word segmentation' },
  { input: 'Innaiku@@ office### poganum', expected: 'Special characters cause conversion issues' },
  { input: '12345 enna idhu', expected: 'Numbers not properly handled' },
  { input: 'Bus     romba        late', expected: 'Extra spaces affect formatting' },
  { input: 'System should not transliterate fully', expected: 'Line breaks may distort output' },
  { input: 'Avan romba nallavan!!!!!', expected: 'Excess punctuation may misbehave' },
  { input: 'Officeku poganum@', expected: 'Invalid character handling issue' },
  { input: 'Thx da macha', expected: 'Chat shorthand not supported' },
  {
    input: 'This is a completely English sentence without Thanglish',
    expected: 'System should not transliterate fully'
  }
];

  




  for (let i = 0; i < tests.length; i++) {
    const { input, expected } = tests[i];

    // Clear textarea
    await textarea.fill('');

    // Type word by word with space to trigger Tamil transliteration
    await typeWithSpaces(textarea, input);

    // Wait until AI transliteration produces Tamil text
    await page.waitForFunction(
      (selector, originalText) => {
        const ta = document.querySelector(selector);
        // Wait until it contains at least one Tamil character
        return ta && /[\u0B80-\u0BFF]/.test(ta.value);
      },
      '#transliterateTextarea',
      input
    );

    // Get the output
    const output = await textarea.inputValue();

    if (output.includes(expected)) {
      console.log(colors.green(`✅ Test ${i + 1} Passed: "${input}" | Output: "${output}"`));
    } else {
      console.log(
        colors.red(
          `❌ Test ${i + 1} Failed: "${input}" | Output: "${output}" | Expected contains: "${expected}"`
        )
      );
    }

    // Clear textarea for next test
    await textarea.click();
    await page.keyboard.press('Control+A');
    await page.keyboard.press('Backspace');

  }
});