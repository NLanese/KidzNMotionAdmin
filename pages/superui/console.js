import React, { useState, useEffect } from "react";

import { useMutation, useQuery } from "@apollo/client";
import client from "@utils/apolloClient";



function Console() {
    return (
      <div>
        <h1>Super console</h1>
        {/* Your SuperUI page content goes here */}
      </div>
    );
  }
  
  export default Console;