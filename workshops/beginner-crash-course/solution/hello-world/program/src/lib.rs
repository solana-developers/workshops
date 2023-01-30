use solana_program::{
    account_info::{AccountInfo, next_account_info}, 
    entrypoint, 
    entrypoint::ProgramResult, 
    msg, 
    pubkey::Pubkey,
};


// Tells Solana that the entrypoint to this program
//  is the "hello_world" function.
//
entrypoint!(hello_world);


fn hello_world(
    program_id: &Pubkey,
    accounts: &[AccountInfo],
    _instruction_data: &[u8],
) -> ProgramResult {

    msg!("Hello, Solana!");
    msg!("Our program's Program ID: {}", &program_id);

    let accounts_iter = &mut accounts.iter();
    let payer = next_account_info(accounts_iter)?;

    msg!("Payer Address: {}", payer.key);

    Ok(())
}