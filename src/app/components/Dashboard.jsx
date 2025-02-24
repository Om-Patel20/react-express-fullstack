import React from "react";
import { connect } from "react-redux";
import { ConnectedTaskList } from "./TaskList";

export const Dashboard = ({groups})=>(
    <div className="row">
            {groups.map(group => (
            <div key={group.id} className="col">
                <ConnectedTaskList id={group.id} name={group.name} />
            </div>
        ))}
    </div>
);

function mapStateToProps(state){
    return {
        groups:state.groups
    }
}

export const ConnectedDashboard = connect(mapStateToProps)(Dashboard);