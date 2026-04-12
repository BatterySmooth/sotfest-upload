import styles from "@components/SpinnerOverlay.module.css";

export const SpinnerOverlay: React.FC = () => {
  return (
    <div className={styles.root}>
      <div className={styles.content}>
        <p>Uploading</p>
        <span className={styles.spinner}></span>
      </div>
    </div>
  );
};