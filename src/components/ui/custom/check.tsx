"use client";
import { Button } from "@/components/ui/button";
import { Store } from "../../../app/store/store"

function Check() {
    const increasePopulation = Store((state: any) => state.increasePopulation)
    return <Button onClick={increasePopulation}>one up</Button>
}

export default Check