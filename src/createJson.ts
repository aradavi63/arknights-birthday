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
  // image: string; 
};

function extractInfoFromStoryText(storyText: string): { name?: string; dob?: string } {
  const lines = storyText.split('\n');
  let name: string | undefined;
  let dob: string | undefined;

  for (const line of lines) {
    if (line.startsWith('[Code Name]')) {
      name = line.replace('[Code Name]', '').trim();
    }
    if (line.startsWith('[Date of Birth]')) {
      dob = line.replace('[Date of Birth]', '').trim();
    }
  }

  return { name, dob };
}

async function fetchOperatorJson(): Promise<OperatorData[]> {
  try {
    const response = await fetch('https://raw.githubusercontent.com/Kengxxiao/ArknightsGameData_YoStar/main/en_US/gamedata/excel/handbook_info_table.json');
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: HandbookData = await response.json();

    // Transform the data into our desired format
    const operators: OperatorData[] = Object.entries(data.handbookDict).map(([id, operatorInfo]) => {
      // Find the "Basic Info" story which contains the code name and date of birth
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

      return {
        id,
        name,
        dob,
      };
    });

    return operators;
  } catch (error) {
    console.error('Error fetching JSON:', error);
    throw error;
  }
}

// Example usage
async function main() {
  const operators = await fetchOperatorJson();
  const operatorInfo = JSON.stringify(operators, null, 2);
  fs.writeFileSync('src/operators.json', operatorInfo, "utf8");
}

export default main();

main();