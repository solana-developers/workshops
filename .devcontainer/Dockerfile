FROM ubuntu

RUN apt update && apt upgrade -y
RUN apt install -y bash bzip2 wget curl gcc-multilib libssl-dev
RUN curl -fsSL https://deb.nodesource.com/setup_16.x | bash -
RUN apt-get install -y nodejs
RUN npm i -g yarn
RUN apt update && apt upgrade -y
RUN curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh -s -- -y -q
RUN wget http://nz2.archive.ubuntu.com/ubuntu/pool/main/o/openssl/libssl1.1_1.1.1f-1ubuntu2.16_amd64.deb
RUN dpkg -i libssl1.1_1.1.1f-1ubuntu2.16_amd64.deb
RUN wget -o solana-release.tar.bz2 https://github.com/solana-labs/solana/releases/download/v1.14.13/solana-release-x86_64-unknown-linux-gnu.tar.bz2
RUN tar jxf solana-release-x86_64-unknown-linux-gnu.tar.bz2
RUN mv solana-release /root/solana-release

ENV HOME=/root
ENV PATH=$HOME/.cargo/bin:$HOME/solana-release/bin:$PATH

COPY .cargo-bpf /tmp/bpf-setup
WORKDIR /tmp/bpf-setup
RUN cargo build-bpf && cargo build-sbf
WORKDIR /
RUN rm -rf /tmp/bpf-setup

RUN solana config set -ud

ENTRYPOINT solana-keygen new --no-bip39-passphrase -s -o $HOME/.config/solana/id.json &&\
    solana config set --keypair $HOME/.config/solana/id.json &&\
    (solana airdrop 2 || sh) &&\
    sh