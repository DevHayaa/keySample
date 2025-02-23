"use client";
import { Store } from "../../../app/store/store"

function Test() {
    const bears = Store((state: any) => state.bears)
    return <h1>{bears} around here ...</h1>
  }
  
export default Test;