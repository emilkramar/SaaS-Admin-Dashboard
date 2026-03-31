import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { TableHeader, UiTableComponent } from './ui-table.component';

describe('UiTableComponent', () => {
  let fixture: ComponentFixture<UiTableComponent>;
  let component: UiTableComponent;

  const headers: TableHeader[] = [
    { key: 'name', label: 'Name', type: 'text', sort: true },
    { key: 'email', label: 'Email', type: 'text', sort: true },
  ];

  const sampleRows = [
    { id: 1, name: 'Zara', email: 'zara@example.com' },
    { id: 2, name: 'Anna', email: 'anna@example.com' },
    { id: 3, name: 'Mike', email: 'mike@example.com' },
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UiTableComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(UiTableComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('headers', headers);
    fixture.componentRef.setInput('rows', sampleRows);
    fixture.componentRef.setInput('loading', false);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render header labels as column titles', () => {
    const ths = fixture.debugElement.queryAll(By.css('thead th'));
    expect(ths.length).toBe(2);
    expect(ths[0].nativeElement.textContent).toContain('Name');
    expect(ths[1].nativeElement.textContent).toContain('Email');
  });

  it('should render one row per data item in the tbody', () => {
    const rows = fixture.debugElement.queryAll(By.css('tbody tr'));
    expect(rows.length).toBe(sampleRows.length);
  });

  it('should render cell text for name and email columns', () => {
    const firstRow = fixture.debugElement.query(By.css('tbody tr'));
    const cells = firstRow.queryAll(By.css('td'));
    expect(cells[0].nativeElement.textContent?.trim()).toBe('Zara');
    expect(cells[1].nativeElement.textContent?.toLowerCase()).toContain('zara@');
  });

  describe('search signal and filtering', () => {
    it('should filter rows by search term after debounce', async () => {
      expect(component.filteredRows().length).toBe(3);

      component.searchValue.set('anna');
      await new Promise<void>((r) => setTimeout(r, 350));
      fixture.detectChanges();

      expect(component.filteredRows().length).toBe(1);
      expect(component.filteredRows()[0].name).toBe('Anna');

      const rows = fixture.debugElement.queryAll(By.css('tbody tr'));
      expect(rows.length).toBe(1);
    });
  });

  describe('sorting by column', () => {
    it('should sort rows by name ascending when toggleSort is used on Name', () => {
      component.toggleSort(headers[0]);

      const names = component.displayRows().map((r: { name: string }) => r.name);
      expect(names).toEqual(['Anna', 'Mike', 'Zara']);
    });
  });

  it('getExportRows returns the same rows as displayRows (full filtered/sorted set)', () => {
    expect(component.getExportRows()).toEqual(component.displayRows());
  });

  it('adds empty actions th and kebab column when actions input is non-empty', () => {
    expect(fixture.debugElement.queryAll(By.css('thead th')).length).toBe(2);

    fixture.componentRef.setInput('actions', [{ param: 'view', label: 'View', permission: true }]);
    fixture.detectChanges();
    expect(fixture.debugElement.queryAll(By.css('thead th')).length).toBe(3);

    fixture.componentRef.setInput('actions', [{ param: 'x', label: 'X', permission: false }]);
    fixture.detectChanges();
    expect(component.visibleActions().length).toBe(0);
    expect(fixture.debugElement.queryAll(By.css('thead th')).length).toBe(3);
  });
});
