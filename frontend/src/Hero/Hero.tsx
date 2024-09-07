import styles from "./hero.module.css";
import { useState } from "react";
import { useScramble } from "use-scramble";
import { IndexService } from "@ethsign/sp-sdk";

const Hero = () => {
  const [bitsCommited, setBitsCommited] = useState(0);
  const { ref } = useScramble({
    text: "Randomness Redefined",
    speed: 0.35,
  });

  const indexService = new IndexService("testnet");
  const attestationsPromise = indexService.queryAttestationList({
    schemaId: "onchain_evm_11155111_0x79",
    page: 1,
  });
  attestationsPromise.then(function (attestations) {
    if (attestations != null) {
      console.log(attestations);
      setBitsCommited(attestations.total * 256);
    }
  });

  return (
    <>
      <div className={styles.background}>
        <div className={styles.heroContainer}>
          <h1 className={styles.heroHeading} ref={ref}></h1>
        </div>
        <div className={styles.heroContainer}>
          <p className={styles.heroText}>
            <span className={styles.number}>{bitsCommited}</span> bits of
            randomness commited to date
          </p>
        </div>
      </div>
    </>
  );
};

export default Hero;
