import {Button, divider, Input, Progress} from "@nextui-org/react";
import styles from './stake.module.css'
import {useState} from "react";

type AddressData = {
  block: number
}

type AddressFormProps = AddressData & {
  updateFields: (fields: Partial<AddressData>) => void
}

export function Commit({
  block,
  updateFields,
}: AddressFormProps) {

const [progress , setProgress] = useState(false)

    const progressVisible = () => {
      setProgress( true)
    }


    return (
        <>
            {!progress ?  <form className={styles.formContainer}>
        <p style={{color:'#dc2626', fontSize:'18px'}}>After this step there is no going back, Do not close your browser until all commitments have been fulfilled.</p>
        <Input
            required
            label='Blocks to Supply'
            type="number"
            value={block}
            variant='bordered'
            color='success'
            placeholder='Min 1.00'
            size='sm'
            onChange={e => updateFields({ block: Number(e.target.value) })}
            classNames={{
                label:'text-white',
                input:'text-white flex ml-[2rem]'
            }}
        />
        <Button style={{backgroundColor:'#45D483', fontWeight:600, width:'100%' , marginBottom:'2rem'}} onClick={progressVisible}>Commit</Button>
      </form> : null}
    {progress ? <div className={styles.progressDiv}>
            <Progress
                size="md"
                isIndeterminate
                aria-label="Progress"
                color='success'
                className="max-w-md"
            />
    </div>
        : null }
    </>
    )
}
