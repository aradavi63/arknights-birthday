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

const imageUrl = 'https://github.com/PuppiizSunniiz/Arknight-Images/tree/main/avatars/';

function extractInfoFromStoryText(storyText: string): { name?: string; dob?: string } {
  const lines = storyText.split('\n');
  let name: string | undefined;
  let dob: string | undefined;

  for (const line of lines) {
    if (line.startsWith('[Code Name]')) {
      name = line.replace('[Code Name]', '').trim();
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

    const operators: OperatorData[] = Object.entries(data.handbookDict).map(([id, operatorInfo]) => {
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

      const image = getOperatorImageUrl(operatorInfo.charID);

      return {
        id,
        name,
        dob,
        image,
      };
    });

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