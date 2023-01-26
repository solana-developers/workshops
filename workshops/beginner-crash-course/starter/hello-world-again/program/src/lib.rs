use borsh::{ BorshDeserialize, BorshSerialize };
use solana_program::{
    account_info::{AccountInfo, next_account_info}, 
    entrypoint, 
    entrypoint::ProgramResult, 
    msg, 
    pubkey::Pubkey,
};


#[derive(BorshSerialize, BorshDeserialize)]
pub enum MyInstruction {
    SayHelloInstruction(SayHelloArgs),
    SayGoodbyeInstruction(SayGoodbyeArgs),
}

#[derive(BorshSerialize, BorshDeserialize)]
pub struct SayHelloArgs {
    hello_message: String,
}

#[derive(BorshSerialize, BorshDeserialize)]
pub struct SayGoodbyeArgs {
    goodbye_message: String,
    second_goodbye_message: String,
}

fn say_hello(args: SayHelloArgs) {
    msg!("{}", args.hello_message);
}

fn say_goodbye(args: SayGoodbyeArgs) {
    msg!("{}", args.goodbye_message);
    msg!("{}", args.second_goodbye_message);
}


entrypoint!(hello_world);

fn hello_world(
    program_id: &Pubkey,
    accounts: &[AccountInfo],
    instruction_data: &[u8],
) -> ProgramResult {

    let instruction = MyInstruction::try_from_slice(&instruction_data)?;
    
    match instruction {
        MyInstruction::SayHelloInstruction(args) => say_hello(args),
        MyInstruction::SayGoodbyeInstruction(args) => say_goodbye(args),
    };

    msg!("Our program's Program ID: {}", &program_id);

    let accounts_iter = &mut accounts.iter();
    let payer = next_account_info(accounts_iter)?;

    msg!("Payer Address: {}", payer.key);

    Ok(())
}