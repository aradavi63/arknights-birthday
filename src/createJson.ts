import fs from 'fs';

type Story = {
  storyText: string;
  unLockType: string;
  unLockParam: string;
  unLockString: string;
  patchIdList: null | string;
};

type StoryTextAudio = {
  stories: Story[];
  storyTitle: string;
  unLockorNot: boolean;
};

type OperatorInfo = {
  charID: string;
  infoName: string;
  isLimited: boolean;
  storyTextAudio: StoryTextAudio[];
  handbookAvgList: unknown; 
};

type HandbookData = {
  handbookDict: {
    [key: string]: OperatorInfo;
  };
};

type OperatorData = {
  id: string;
  name: string;
  dob: string;
  image: string; 
};

const imageUrl = 'https://raw.githubusercontent.com/PuppiizSunniiz/Arknight-Images/refs/heads/main/avatars/';

function extractInfoFromStoryText(storyText: string): { name?: string; dob?: string } {
  const lines = storyText.split('\n');
  let name: string | undefined;
  let dob: string | undefined;

  for (const line of lines) {
    if (line.startsWith('[Code Name]')) {
      name = line.replace('[Code Name]', '').trim();
    }
    else if (line.startsWith('[Codename]')) {
      name = line.replace('[Codename]', '').trim();
    }
    else if (line.startsWith('[Model]')) {
      name = line.replace('[Model]', '').trim();
    }
    if (line.startsWith('[Date of Birth]')) {
      dob = line.replace('[Date of Birth]', '').trim();
    }
    else if (line.startsWith('[Date of Release]')) {
      dob = line.replace('[Date of Release]', '').trim();
    }
    if (name != undefined && dob != undefined) { // Break because Ifrit's file is read twice
      break
    }
  }
  if (dob && dob.endsWith('th')) { // Flint's birthday is the only one with ordinals, need to clean
    dob = dob.slice(0,-2); 
  }

  return { name, dob };
}

function getOperatorImageUrl(operatorId: string): string {
  return imageUrl + operatorId + '.png';
}

async function fetchOperatorJson(): Promise<OperatorData[]> {
  try {
    const response = await fetch('https://raw.githubusercontent.com/Kengxxiao/ArknightsGameData_YoStar/main/en_US/gamedata/excel/handbook_info_table.json');
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: HandbookData = await response.json();

    const operatorEntries = Object.entries(data.handbookDict).filter(([id]) => id.startsWith('char'));
    const seenNames = new Set<string>();
    const operators: OperatorData[] = [];

    for (const [id, operatorInfo] of operatorEntries) {
      const basicInfoStory = operatorInfo.storyTextAudio.find(
        (story) => story.storyTitle === 'Basic Info'
      );

      let name = 'Unknown';
      let dob = 'Unknown';

      if (basicInfoStory && basicInfoStory.stories.length > 0) {
        const extracted = extractInfoFromStoryText(basicInfoStory.stories[0].storyText);
        name = extracted.name || 'Unknown';
        dob = extracted.dob || 'Unknown';
      }

      if (seenNames.has(name)) {
        continue;
      }
      else if (name === 'Lava the Purgatory' && seenNames.has('Lava')) { // The only alter who has the full title inside handbook
        continue;
      }
      seenNames.add(name);

      const image = getOperatorImageUrl(operatorInfo.charID);

      operators.push({
        id,
        name,
        dob,
        image,
      });
    }

    return operators;
  } catch (error) {
    console.error('Error fetching JSON:', error);
    throw error;
  }
}

async function main() {
  const operators = await fetchOperatorJson();
  const operatorData = JSON.stringify(operators, null, 2);
  fs.writeFileSync('src/operators.json', operatorData, "utf8");
}

main();