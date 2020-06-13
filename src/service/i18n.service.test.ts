import { languageSpecificMagic } from './i18n.service';

test('should process DE pattern function', () => {
  const patternConvertion = languageSpecificMagic['de'].pattern('12', '63 %.');
  expect(patternConvertion).toBe(`Um 13 Uhr zu 63 % ausgelastet.`);
});

test('should process DE extractLocalizedValues function', () => {
  const input = [
    { time: '01', value: '80' },
    { time: '24', value: '0' },
    { time: '13', value: '100' }
  ];

  input.forEach((entry, index) => {
    const timeValuePair = languageSpecificMagic['de'].extractLocalizedValues(
      `Um ${entry.time} Uhr zu ${entry.value} % ausgelastet.`
    );
    expect(timeValuePair).toMatchObject({
      time: Number(input[index].time),
      value: Number(input[index].value)
    });
  });
});
