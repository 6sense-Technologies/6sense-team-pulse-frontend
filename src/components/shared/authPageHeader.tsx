interface TAuthPageHeaderProps {
  title: string;
  subTitle: string;
  titleClassName?: string;
  subTitleClassName?: string;
}

const AuthPageHeader = ({ title, subTitle, titleClassName, subTitleClassName }: TAuthPageHeaderProps) => {
  return (
    <div>
      <h3 className={`text-2xl font-semibold ${titleClassName}`}>{title}</h3>
      <p className={`text-sm text-start leading-normal text-subHeading ${subTitleClassName}`}>{subTitle}</p>
    </div>
  );
};

export default AuthPageHeader;
