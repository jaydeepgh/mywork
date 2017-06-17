import React, {Component} from 'react';
import {BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend} from 'recharts';
import {connect} from 'react-redux';



class AssemblyLineChart extends Component{

	render () {
            
            if(typeof this.props.assemblyChartData!= 'undefined' && this.props.assemblyChartData.length > 0){

                  return (
                      <div className="chartPan">
                <BarChart width={600} height={300} data={this.props.assemblyChartData}
                margin={{top: 15, right: 20, left: 0, bottom: 5}}>
                  <Legend verticalAlign="top" />
                  <XAxis dataKey="date"/>
                  <YAxis interval={0} allowDecimals={false} />
                  <CartesianGrid strokeDasharray="1 1"/>
                  <Tooltip/>                  
                  <Bar dataKey="Created" stackId = "a" fill="#8884d8" />
                  <Bar dataKey="QA Failed" stackId = "a" fill="#ff1060" />
                  <Bar dataKey="Rectified" stackId = "a" fill="#82cd9a" />
                  <Bar dataKey="QA Tested" stackId = "a" fill="#82c444" />                  
                  </BarChart>
                  </div>
                  );

            }else{
                return(<div>Loading .....</div>);
            }

  }

} 

function mapStateToProps(state){
    return {assemblyChartData : state.assembly.assemblyChartData};
}


export default connect(mapStateToProps,null)(AssemblyLineChart);