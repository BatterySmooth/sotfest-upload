import { AcrylicCover } from '@components/AcrylicCover';
import buttonstyles from "@components/IconButton.module.css";
import styles from '@components/ConfirmDialog.module.css';

type ConfirmDialogProps = {
  onConfirm: () => void;
  onCancel: () => void;
  title: string,
  content: string,
};

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  onConfirm,
  onCancel,
  title,
  content
}) => {

  return (
    <>
      <AcrylicCover />
      <div className={styles.container}>
        <div className={styles.dialog}>
          <p className={styles.header}>{title}</p>
          <div className={styles.content}>
            {content}
            <div className={styles.buttonRow}>
              <button
                className={[buttonstyles.button, styles.button, styles.cancelButton].join(" ")}
                onClick={onCancel}>
                  No
              </button>
              <button
                className={[buttonstyles.button, styles.button].join(" ")}
                onClick={onConfirm}>
                  Yes
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};