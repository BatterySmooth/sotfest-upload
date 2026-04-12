import styles from "@components/LoginButton.module.css";

interface LoginButtonProps {
  onClick: () => void;
}

export const LoginButton: React.FC<LoginButtonProps> = ({
  onClick,
}) => {
  return (
    <div className={styles.root}>
      <div className={styles.content}>
        <button className={styles.button} onClick={() => onClick()}>
          Login with Google
        </button>
      </div>
    </div>
  );
};