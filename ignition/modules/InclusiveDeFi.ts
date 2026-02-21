// ignition/modules/InclusiveDeFi.ts
import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const InclusiveDeFiModule = buildModule("InclusiveDeFiModule", (m) => {
  // This line tells Ignition to deploy the "InclusiveDeFi" contract
  const inclusiveDeFi = m.contract("InclusiveDeFi");

  return { inclusiveDeFi };
});

export default InclusiveDeFiModule;