import { useState } from "react";
import clsx from "clsx";
import { ProfileUpdateForm, type ProfileEditableField } from "@/features/profile/update";
import type { ProfileContactItem, ProfileStatItem } from "@/entities/profile/model";
import Button from "@/shared/ui/Button";
import Icon from "@/shared/ui/Icon";
import Modal from "@/shared/ui/Modal";
import styles from "./ProfileOverview.module.scss";

type ProfileOverviewProps = {
  editLabel: string;
  profile: {
    fullName: string;
    membershipLabel: string;
    joinedLabel: string;
    avatarUrl: string | null;
    initials: string;
    phone: string;
    contacts: ProfileContactItem[];
  };
  stats: ProfileStatItem[];
};

const ProfileOverview = ({ editLabel, profile, stats }: ProfileOverviewProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [focusField, setFocusField] = useState<ProfileEditableField | undefined>();

  const closeModal = () => {
    setFocusField(undefined);
    setIsEditing(false);
  };

  const openEditModal = (field: ProfileEditableField = "username") => {
    setFocusField(field);
    setIsEditing(true);
  };

  return (
    <>
      <div className={clsx("surface", "surface--glass", styles.card)}>
        <div className={styles.hero}>
          <div className={styles.heroTop}>
            <div className={styles.identity}>
              <div className={styles.avatarShell}>
                <div
                  className={clsx(styles.avatar, {
                    [styles["avatar--image"]]: Boolean(profile.avatarUrl),
                  })}
                  style={
                    profile.avatarUrl ? { backgroundImage: `url(${profile.avatarUrl})` } : undefined
                  }
                >
                  {!profile.avatarUrl && (
                    <span className={styles.initials}>{profile.initials}</span>
                  )}
                </div>

                <button
                  aria-label="Изменить аватар"
                  className={styles.avatarAction}
                  onClick={() => {
                    openEditModal("avatarUrl");
                  }}
                  type="button"
                >
                  <Icon name="camera" />
                </button>
              </div>

              <div className={styles.identityBody}>
                <div className={styles.identityHeading}>
                  <h2 className={styles.name}>{profile.fullName}</h2>

                  <div className={styles.badgeRow}>
                    <span className={styles.badge}>
                      <Icon name="crown" />
                      {profile.membershipLabel}
                    </span>
                  </div>
                </div>

                <p className={styles.joined}>{profile.joinedLabel}</p>
              </div>
            </div>

            <Button
              className={styles.editButton}
              onClick={() => {
                openEditModal("username");
              }}
              size="md"
              variant="primary"
            >
              {editLabel}
            </Button>
          </div>

          <div className={styles.contacts}>
            {profile.contacts.map((contact) => (
              <div className={styles.contact} key={contact.id}>
                <span className={styles.contactIcon}>
                  <Icon name={contact.icon} />
                </span>

                <div className={styles.contactBody}>
                  <span className={styles.contactLabel}>{contact.label}</span>
                  <span className={styles.contactValue}>{contact.value}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className={styles.stats}>
          {stats.map((stat) => (
            <div className={styles.stat} key={stat.id}>
              <span className={clsx(styles.statIcon, styles[`statIcon--${stat.accent}`])}>
                <Icon name={stat.icon} />
              </span>

              <div className={styles.statBody}>
                <span className={styles.statValue}>{stat.value}</span>
                <span className={styles.statLabel}>{stat.label}</span>
                <span className={styles.statDescription}>{stat.description}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <Modal
        description="Обновите имя, телефон и ссылку на фотографию. Email пока остается только для чтения."
        isOpen={isEditing}
        onClose={closeModal}
        title="Редактирование профиля"
      >
        <ProfileUpdateForm
          autoFocusField={focusField}
          avatarUrl={profile.avatarUrl}
          layout="modal"
          onAutoFocusHandled={() => {
            setFocusField(undefined);
          }}
          onCancel={closeModal}
          phone={profile.phone}
          showHeader={false}
          username={profile.fullName}
        />
      </Modal>
    </>
  );
};

export default ProfileOverview;
