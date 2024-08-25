import styles from './hero.module.css'
import { useScramble } from "use-scramble"

const Hero = () => {
    const { ref } = useScramble({
        text: "Randomness Redefined",
        speed:0.35
    });

    return(
        <>
           <div className={styles.heroContainer}>
               <h1 className={styles.heroText} ref={ref}></h1>

           </div>
        </>
    )
}

export default Hero