import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useGameStore } from '../stores/gameStore';
import type { LayoutInfo } from '../utils/responsive';
import styles from './InventoryScreen.module.css';

interface InventoryScreenProps {
  layout: LayoutInfo;
}

export default function InventoryScreen({ layout }: InventoryScreenProps) {
  const { t } = useTranslation();
  const inventoryOpen = useGameStore((s) => s.inventoryOpen);
  const inventoryTab = useGameStore((s) => s.inventoryTab);
  const evidence = useGameStore((s) => s.evidence);
  const persons = useGameStore((s) => s.persons);
  const info = useGameStore((s) => s.info);
  const presentMode = useGameStore((s) => s.presentMode);
  const presentCallback = useGameStore((s) => s.presentCallback);
  const toggleInventory = useGameStore((s) => s.toggleInventory);
  const setInventoryTab = useGameStore((s) => s.setInventoryTab);
  const setPresentMode = useGameStore((s) => s.setPresentMode);

  const handleClose = useCallback(() => {
    toggleInventory(false);
    if (presentMode) {
      setPresentMode(false);
    }
  }, [toggleInventory, presentMode, setPresentMode]);

  const handleItemClick = useCallback(
    (type: string, id: string) => {
      if (presentMode && presentCallback) {
        presentCallback(type, id);
        toggleInventory(false);
      }
    },
    [presentMode, presentCallback, toggleInventory]
  );

  if (!inventoryOpen) return null;

  const tabs = [
    { key: 'evidence' as const, label: t('inventory_evidence'), count: evidence.length },
    { key: 'persons' as const, label: t('inventory_persons'), count: persons.length },
    { key: 'info' as const, label: t('inventory_info'), count: info.length },
  ];

  const currentItems =
    inventoryTab === 'evidence'
      ? evidence.map((e) => ({ type: 'evidence', id: e.id, name: e.name, desc: e.description, image: e.image }))
      : inventoryTab === 'persons'
        ? persons.map((p) => ({ type: 'person', id: p.id, name: p.name, desc: p.description, image: p.image }))
        : info.map((i) => ({ type: 'info', id: i.id, name: i.name, desc: i.description, image: '' }));

  return (
    <div
      className={styles.overlay}
      style={{
        left: 0,
        top: 0,
        width: '100vw',
        height: '100dvh',
      }}
    >
      <div className={styles.panel} style={{ fontSize: layout.scale * 16 }}>
        {presentMode && (
          <div className={styles.presentBanner} style={{ fontSize: layout.scale * 18 }}>
            {t('inventory_present_prompt')}
          </div>
        )}

        <div className={styles.tabs}>
          {tabs.map((tab) => (
            <button
              key={tab.key}
              className={`${styles.tab} ${inventoryTab === tab.key ? styles.activeTab : ''}`}
              onClick={() => setInventoryTab(tab.key)}
            >
              {tab.label} ({tab.count})
            </button>
          ))}
        </div>

        <div className={styles.itemList}>
          {currentItems.length === 0 ? (
            <div className={styles.empty}>{t('inventory_empty')}</div>
          ) : (
            currentItems.map((item) => (
              <div
                key={item.id}
                className={`${styles.item} ${presentMode ? styles.selectable : ''}`}
                onClick={() => handleItemClick(item.type, item.id)}
              >
                {item.image && (
                  <img src={item.image} alt={item.name} className={styles.itemImage} />
                )}
                {!item.image && <div className={styles.itemImagePlaceholder}>📋</div>}
                <div className={styles.itemInfo}>
                  <div className={styles.itemName}>{item.name}</div>
                  <div className={styles.itemDesc}>{item.desc}</div>
                </div>
              </div>
            ))
          )}
        </div>

        <button
          className={styles.closeBtn}
          style={{ fontSize: layout.scale * 16 }}
          onClick={handleClose}
        >
          {t('ui_close')}
        </button>
      </div>
    </div>
  );
}
