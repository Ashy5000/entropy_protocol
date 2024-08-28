import { FormWrapper } from "./FormWrapper"
import styles from "./stake.module.css";
import {Button, Input, Progress} from "@nextui-org/react";

type AccountData = {
  unstake:number
}


export function Unstake({
 unstake
                            }) {
  return (
      <>
           <form className={styles.formContainer}>
              <p style={{color:'#ffffff', fontSize:'18px'}}>You cannot unstake when you have unfulfilled commitments</p>
              <Input
                  required
                  label='Amount'
                  type="number"
                  value={block}
                  variant='bordered'
                  color='success'
                  placeholder='Min 1.00'
                  size='sm'
                  classNames={{
                      label:'text-white',
                      input:'text-white flex ml-[2rem]'
                  }}
              />
              <Button style={{backgroundColor:'#45D483', fontWeight:600, width:'100%' , marginBottom:'2rem'}}>Unstake</Button>
          </form>

      </>
  )
}
