import Associateprinciples from './Associateprinciples';
import Highlevelprinciples from './highlevelprinciples';
import ScatterChart from './ScatterChart';
import SortableTable from './table';
import { defaults } from 'chart.js';


defaults.responsive = true;
const App = () => {
  return (
    <>
    <div className="global-con">
      <div className="global_box">
        <h2>Scatter Chart: Level of Evaluation vs Level of Development</h2>
        <ScatterChart />
      </div>
      <div className="individual_box">
      <div className='pricnciples-con'>
        <Associateprinciples />
        <Highlevelprinciples />
        </div>
      
      </div>
      <SortableTable />
    </div>
    </>
  );
}

export default App;
