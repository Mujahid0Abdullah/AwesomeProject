import { theme } from "../utils";
import React from "react";
const GlobalContext = React.createContext({
theme,
rooms:[],
setRooms: () =>{},
unfilteredRooms: [],
setUnfilteredRooms: () => {}
});

export default GlobalContext; 
