import React from "react";
import { Provider } from "react-redux";
import { store } from "../store";
import { ConnectedDashbaord } from "./Dashboard";

export const Main = () => (
    <Provider store={store}>
        <div>
            <ConnectedDashbaord/>
        </div>
    </Provider>
)