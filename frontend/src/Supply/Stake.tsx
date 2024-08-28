import {Button, Input} from "@nextui-org/react";
import {useState} from "react";
import {Commit} from "./Commit.tsx";
import styles from './stake.module.css'
type UserData = {
  tokens: number;
}

type UserFormProps = UserData & {
  updateFields: (fields: Partial<UserData>) => void
}


export function Stake({
 tokens,
}: UserFormProps) {
    const [error, setError] = useState('')
    const [stake , setStake] = useState(true)

    function handleInputChange(e){
        const value = Number(e.target.value)
        if(value === 0){
            setError('Stake Amount cannot be empty')
        }else{
            setError('')
        }
    }

    function goToCommit(event){
        event.preventDefault()
        if(!error){
            setStake(false)
        }
    }

  return (
      <>
          {stake ?  <form className={styles.formContainer}>
        {error ? <p style={{color:'#dc2626'}}>{error}</p> : null}
      <Input
        required
        label='Amount'
        type="number"
        value={tokens}
        variant='bordered'
        color='success'
        placeholder='Min 1.00'
        size='sm'
        onChange={handleInputChange}
        classNames={{
            label:'text-white',
            input:'text-white flex ml-[2rem]'
        }}
      />
        <Button style={{backgroundColor:'#45D483', fontWeight:600, width:'100%' , marginBottom:'2rem'}} onClick={goToCommit} >Stake</Button>
    </form> : null }
          {!stake ? <Commit /> : null}
      </>
  )
}
