import { time, loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { anyValue } from "@nomicfoundation/hardhat-chai-matchers/withArgs";
import { expect } from "chai";
import { ethers} from 'hardhat'; 

describe("GreeterTestSuite", function(){

    async function runEveryTime(){
        
        const [owner, otherAccounts] = await ethers.getSigners();
        const Greeter = await ethers.getContractFactory("Greeter");
        const greeter = await Greeter.deploy("Hello world");
        console.log(greeter);

        return greeter;
    }

    describe("Deploy", function(){
        it("Should check initial greeting", async function(){
            const greeter = await loadFixture(runEveryTime);
            expect(await greeter.greet()).to.equal("Hello world");
        })
    })

})