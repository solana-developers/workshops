#![allow(unused_imports)]
#![allow(unused_variables)]
#![allow(unused_mut)]
use crate::{id, seahorse_util::*};
use anchor_lang::{prelude::*, solana_program};
use anchor_spl::token::{self, Mint, Token, TokenAccount};
use std::{cell::RefCell, rc::Rc};

#[account]
#[derive(Debug)]
pub struct PizzaOrder {
    pub order: u8,
    pub pepperoni: u8,
    pub mushrooms: u8,
    pub olives: u8,
}

impl<'info, 'entrypoint> PizzaOrder {
    pub fn load(
        account: &'entrypoint mut Box<Account<'info, Self>>,
        programs_map: &'entrypoint ProgramsMap<'info>,
    ) -> Mutable<LoadedPizzaOrder<'info, 'entrypoint>> {
        let order = account.order;
        let pepperoni = account.pepperoni;
        let mushrooms = account.mushrooms;
        let olives = account.olives;

        Mutable::new(LoadedPizzaOrder {
            __account__: account,
            __programs__: programs_map,
            order,
            pepperoni,
            mushrooms,
            olives,
        })
    }

    pub fn store(loaded: Mutable<LoadedPizzaOrder>) {
        let mut loaded = loaded.borrow_mut();
        let order = loaded.order;

        loaded.__account__.order = order;

        let pepperoni = loaded.pepperoni;

        loaded.__account__.pepperoni = pepperoni;

        let mushrooms = loaded.mushrooms;

        loaded.__account__.mushrooms = mushrooms;

        let olives = loaded.olives;

        loaded.__account__.olives = olives;
    }
}

#[derive(Debug)]
pub struct LoadedPizzaOrder<'info, 'entrypoint> {
    pub __account__: &'entrypoint mut Box<Account<'info, PizzaOrder>>,
    pub __programs__: &'entrypoint ProgramsMap<'info>,
    pub order: u8,
    pub pepperoni: u8,
    pub mushrooms: u8,
    pub olives: u8,
}

pub fn create_pizza_order_handler<'info>(
    mut payer: SeahorseSigner<'info, '_>,
    mut pizza_order: Empty<Mutable<LoadedPizzaOrder<'info, '_>>>,
    mut order: u8,
    mut pepperoni: u8,
    mut mushrooms: u8,
    mut olives: u8,
) -> () {
    let mut pizza_order = pizza_order.account.clone();

    assign!(pizza_order.borrow_mut().order, order);

    assign!(pizza_order.borrow_mut().pepperoni, pepperoni);

    assign!(pizza_order.borrow_mut().mushrooms, mushrooms);

    assign!(pizza_order.borrow_mut().olives, olives);
}
