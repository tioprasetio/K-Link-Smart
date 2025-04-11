import { useEffect } from "react";
import { useDarkMode } from "../context/DarkMode";
const Payment = () => {
  const { isDarkMode } = useDarkMode();
  useEffect(() => {
    // Pastikan elemen ada sebelum memprosesnya
    const logo = document.querySelector(".logo");
    const logo2 = document.querySelector(".logo2");
    const logoContainer = document.querySelector(".logo-container");
    const logoContainer2 = document.querySelector(".logo-container2");

    if (logo && logoContainer) {
      const clonedLogo = logo.cloneNode(true) as HTMLElement;
      logoContainer.appendChild(clonedLogo);
    }

    if (logo2 && logoContainer2) {
      const clonedLogo2 = logo2.cloneNode(true) as HTMLElement;
      logoContainer2.appendChild(clonedLogo2);
    }
  }, []); // Hanya dijalankan sekali setelah komponen dirender

  return (
    <section className="w-full mx-auto flex flex-col gap-4 mt-8">
      <h2
        className={`${
          isDarkMode ? "text-[#f0f0f0]" : "text-[#353535]"
        } font-bold text-xl`}
      >
        Pembayaran
      </h2>
      <div
        className={`w-full flex flex-col relative before:absolute after:absolute before:top-0 after:top-0 before:bottom-0 after:bottom-0 before:w-[30%] after:w-[30%] before:left-0 after:right-0 before:z-10 after:z-10
    ${
      isDarkMode
        ? "before:bg-gradient-to-l before:from-transparent before:to-[#140c00] after:bg-gradient-to-r after:from-transparent after:to-[#140c00]"
        : "before:bg-gradient-to-l before:from-transparent before:to-[#f6f5fa] after:bg-gradient-to-r after:from-transparent after:to-[#f6f5fa]"
    }`}
      >
        <div className="logo-container">
          <div className="logo">
            <img
              className="gambar-logo"
              src="https://3.bp.blogspot.com/-dkxCmuCEATY/UmGrMJybxsI/AAAAAAAAC_4/K8FZp3RslI4/s1600/Logo-Bank-Mandiri-Transparent-Background.png"
              alt="Bank Mandiri"
            />
            <img
              className="gambar-logo"
              src="https://logos-download.com/wp-content/uploads/2017/03/BCA_logo_Bank_Central_Asia-700x222.png"
              alt="BCA"
            />
            <img
              className="gambar-logo"
              src="https://cdn.freelogovectors.net/wp-content/uploads/2022/03/permata_bank_logo_freelogovectors.net_.png"
              alt="Permata Bank"
            />
            <img
              className="gambar-logo"
              src="https://www.freepnglogos.com/uploads/visa-card-logo-9.png"
              alt="Visa"
            />
            <img
              className="gambar-logo"
              src="https://logodix.com/logo/1628969.png"
              alt="Alto"
            />
            <img
              className="gambar-logo"
              src="https://1.bp.blogspot.com/--5kyRID4c5I/YHy3H1FVmmI/AAAAAAAAcgU/RhJDG7y8hMUhwJ-9Xd8GW2cpMn9k9uo6QCLcBGAsYHQ/s0/logo-bank-BRI-baru_237-design.png"
              alt="BRI"
            />
            <img
              className="gambar-logo"
              src="https://th.bing.com/th/id/R.867a61b8550f1bafa7e474e1d68642b0?rik=EMRbphrCE5CG4A&riu=http%3a%2f%2f4.bp.blogspot.com%2f-KgCc58KBFD4%2fVo4D9rtFCfI%2fAAAAAAAAAnU%2fcgCYSouN3-4%2fs1600%2ftcash25.png&ehk=E2t5GWzzgsrYfv5bi1BgE5n4i%2fgRHyvZdk8hhzC%2bFWo%3d&risl=&pid=ImgRaw&r=0"
              alt="T-Cash"
            />
          </div>
        </div>
        <div className="logo-container2">
          <div className="logo2">
            <img
              className="gambar-logo2"
              src="https://1.bp.blogspot.com/-s9JMd4raCW4/YLyOlTq_GkI/AAAAAAAAFPs/WCm23M-xHgwSxLRVcvqnke9pJeK8xD7xgCLcBGAsYHQ/s1600/Logo%2BATM%2BBersama.png"
              alt="ATM Bersama"
            />
            <img
              className="gambar-logo2"
              src="https://cdn.freelogovectors.net/wp-content/uploads/2022/03/permata_bank_logo_freelogovectors.net_.png"
              alt="Permata Bank"
            />
            <img
              className="gambar-logo2"
              src="https://www.freepnglogos.com/uploads/visa-card-logo-9.png"
              alt="Visa"
            />
            <img
              className="gambar-logo2"
              src="https://web.kasir.id/wp-content/uploads/2020/04/logo_espay.png"
              alt="Espay"
            />
            <img
              className="gambar-logo2"
              src="https://logos-world.net/wp-content/uploads/2020/09/Mastercard-Logo-2016-2020.png"
              alt="Mastercard"
            />
            <img
              className="gambar-logo2"
              src="https://logos-download.com/wp-content/uploads/2017/03/BCA_logo_Bank_Central_Asia-700x222.png"
              alt="BCA"
            />
            <img
              className="gambar-logo2"
              src="https://th.bing.com/th/id/R.867a61b8550f1bafa7e474e1d68642b0?rik=EMRbphrCE5CG4A&riu=http%3a%2f%2f4.bp.blogspot.com%2f-KgCc58KBFD4%2fVo4D9rtFCfI%2fAAAAAAAAAnU%2fcgCYSouN3-4%2fs1600%2ftcash25.png&ehk=E2t5GWzzgsrYfv5bi1BgE5n4i%2fgRHyvZdk8hhzC%2bFWo%3d&risl=&pid=ImgRaw&r=0"
              alt="T-Cash"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Payment;
