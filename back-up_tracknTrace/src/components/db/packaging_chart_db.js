import React, {Component} from 'react';
import {BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend} from 'recharts';
import {connect} from 'react-redux';



class PackagingChart extends Component{

	render () {
            
            if(typeof this.props.packagingChartData!= 'undefined' && this.props.packagingChartData.length > 0){

                  return (
                    <div className="chartPan">
                        <BarChart width={600} height={300} data={this.props.packagingChartData}
                        margin={{top: 15, right: 20, left: 0, bottom: 5}}>
                            <Legend verticalAlign="top" />
                            <XAxis dataKey="date"/>
                            <YAxis interval={0} allowDecimals={false} />
                            <CartesianGrid strokeDasharray="1 1"/>
                            <Tooltip/>                  
                            <Bar dataKey="Packaging Complete" stackId = "a" fill="#8884d8" />
                            <Bar dataKey="Shipped" stackId = "a" fill="#82c444" />           
                            <Bar dataKey="Cancelled" stackId = "a" fill="#ff1060" />       
                        </BarChart>
                    </div>
                  );

            }else{
                return(<div>Loading .....</div>);
            }

  }

} 

function mapStateToProps(state){
    return {packagingChartData : state.packaging.packagingChartData};
}


export default connect(mapStateToProps,null)(PackagingChart);