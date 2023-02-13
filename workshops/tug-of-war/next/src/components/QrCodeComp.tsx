import { PublicKey } from "@solana/web3.js";
import useGetQRCode from "./useGetQRCode";

interface Props {
  instruction: String;
  address: PublicKey;
  size: number;
}

const QRCode = ({ instruction, address, size }: Props) => {
  const { qrCode } = useGetQRCode(instruction, address, size);

  if (!qrCode) return null;

  return <>     
   <div>
   <h1 style={{
    color: "white",
    fontWeight: "bold"
  }}>
    {instruction}
  </h1><img src={qrCode} alt="Link QR code" />
   </div>
</>;
};

export default QRCode;