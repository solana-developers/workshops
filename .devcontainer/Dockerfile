FROM frolvlad/alpine-glibc

RUN apk update && apk upgrade -a &&\
    apk add --update bash build-base wget curl nodejs npm eudev-dev &&\
    npm i -g yarn &&\
    curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh -s -- -y -q &&\
    mv root/.cargo $PWD/.cargo &&\
    wget -o solana-release.tar.bz2 https://github.com/solana-labs/solana/releases/download/v1.14.13/solana-release-x86_64-unknown-linux-gnu.tar.bz2 &&\
    tar jxf solana-release-x86_64-unknown-linux-gnu.tar.bz2

ENV PATH=$PWD/.cargo/bin:$PWD/solana-release/bin:$PATH

RUN solana config set -ud

ENTRYPOINT solana-keygen new --no-bip39-passphrase -o $HOME/.config/solana/id.json &&\
    solana config set --keypair $HOME/.config/solana/id.json &&\
    solana airdrop 2 &&\
    sh