import "@/styles/loader.css";

export const Loader = () => {
  return (
    <div className="flex flex-row justify-center">
      <div className="lds-ring">
        <div></div>
        <div></div>
        <div></div>
        <div></div>
      </div>
    </div>
  );
};
