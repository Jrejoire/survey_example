import { CustomWidgetCollection } from 'survey-core';
import { Search } from './Widgets/Search';
import { SurveyCreatorComponent, SurveyCreator } from 'survey-creator-react';
import "survey-creator-core/survey-creator-core.min.css";
import "survey-core/defaultV2.min.css";

const App = () => {
  CustomWidgetCollection.Instance.addCustomWidget(Search, "customtype");
  
  const creatorOptions = {
    showLogicTab: true,
    isAutoSave: true
  };
  
  const creator = new SurveyCreator(creatorOptions);

  return (
    <div className="App">
      <SurveyCreatorComponent creator={creator} />
    </div>
  );
}

export default App;
