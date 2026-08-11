document.addEventListener('DOMContentLoaded', () => {

    /*
    |--------------------------------------------------------------------------
    | Request Leave Modal
    |--------------------------------------------------------------------------
    */

    const openLeaveModalButton = document.getElementById('open-leave-modal');
    const leaveRequestModal = document.getElementById('leave-request-modal');
    const closeLeaveModalButton = document.getElementById('close-leave-modal');
    const cancelLeaveModalButton = document.getElementById('cancel-leave-modal');

    const openLeaveRequestModal = () => {

        if (!leaveRequestModal) {
            return;
        }

        leaveRequestModal.classList.remove('hidden');
        leaveRequestModal.classList.add('flex');

        document.body.classList.add('overflow-hidden');
    };

    const closeLeaveRequestModal = () => {

        if (!leaveRequestModal) {
            return;
        }

        leaveRequestModal.classList.add('hidden');
        leaveRequestModal.classList.remove('flex');

        document.body.classList.remove('overflow-hidden');
    };

    if (openLeaveModalButton) {

        openLeaveModalButton.addEventListener(
            'click',
            openLeaveRequestModal
        );

    }

    if (closeLeaveModalButton) {

        closeLeaveModalButton.addEventListener(
            'click',
            closeLeaveRequestModal
        );

    }

    if (cancelLeaveModalButton) {

        cancelLeaveModalButton.addEventListener(
            'click',
            closeLeaveRequestModal
        );

    }


    /*
    |--------------------------------------------------------------------------
    | View Leave Details Modal
    |--------------------------------------------------------------------------
    */

    const leaveDetailsModal = document.getElementById(
        'leave-details-modal'
    );

    const closeLeaveDetailsModalButton = document.getElementById(
        'close-leave-details-modal'
    );

    const closeLeaveDetailsButton = document.getElementById(
        'close-leave-details-button'
    );


    /*
    |--------------------------------------------------------------------------
    | Modal Fields
    |--------------------------------------------------------------------------
    */

    const detailLeaveType = document.getElementById(
        'detail-leave-type'
    );

    const detailStatus = document.getElementById(
        'detail-status'
    );

    const detailStartDate = document.getElementById(
        'detail-start-date'
    );

    const detailEndDate = document.getElementById(
        'detail-end-date'
    );

    const detailDays = document.getElementById(
        'detail-days'
    );

    const detailSubmitted = document.getElementById(
        'detail-submitted'
    );

    const detailReason = document.getElementById(
        'detail-reason'
    );

    const detailRejectionContainer = document.getElementById(
        'detail-rejection-container'
    );

    const detailRejectionReason = document.getElementById(
        'detail-rejection-reason'
    );


    /*
    |--------------------------------------------------------------------------
    | Open View Modal
    |--------------------------------------------------------------------------
    */

    const openLeaveDetailsModal = (button) => {

        if (!leaveDetailsModal) {
            return;
        }


        /*
        |--------------------------------------------------------------------------
        | Get Data From Button
        |--------------------------------------------------------------------------
        */

        const leaveType =
            button.dataset.leaveType || '—';

        const startDate =
            button.dataset.startDate || '—';

        const endDate =
            button.dataset.endDate || '—';

        const days =
            button.dataset.days || '—';

        const reason =
            button.dataset.reason || '—';

        const submitted =
            button.dataset.submitted || '—';

        const status =
            button.dataset.status || '—';

        const rejectionReason =
            button.dataset.rejectionReason || '';


        /*
        |--------------------------------------------------------------------------
        | Put Data Into Modal
        |--------------------------------------------------------------------------
        */

        if (detailLeaveType) {

            detailLeaveType.textContent =
                leaveType;

        }

        if (detailStartDate) {

            detailStartDate.textContent =
                startDate;

        }

        if (detailEndDate) {

            detailEndDate.textContent =
                endDate;

        }

        if (detailDays) {

            detailDays.textContent =
                `${days} ${days == 1 ? 'day' : 'days'}`;

        }

        if (detailSubmitted) {

            detailSubmitted.textContent =
                submitted;

        }

        if (detailReason) {

            detailReason.textContent =
                reason;

        }


        /*
        |--------------------------------------------------------------------------
        | Status
        |--------------------------------------------------------------------------
        */

        if (detailStatus) {

            detailStatus.innerHTML = '';

            const statusBadge =
                document.createElement('span');

            const statusDot =
                document.createElement('span');


            statusBadge.className =
                'inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold';

            statusDot.className =
                'h-1.5 w-1.5 rounded-full';


            if (status === 'Pending') {

                statusBadge.classList.add(
                    'bg-amber-50',
                    'text-amber-700'
                );

                statusDot.classList.add(
                    'bg-amber-500'
                );

            } else if (status === 'Approved') {

                statusBadge.classList.add(
                    'bg-green-50',
                    'text-green-700'
                );

                statusDot.classList.add(
                    'bg-green-500'
                );

            } else if (status === 'Rejected') {

                statusBadge.classList.add(
                    'bg-red-50',
                    'text-red-700'
                );

                statusDot.classList.add(
                    'bg-red-500'
                );

            } else {

                statusBadge.classList.add(
                    'bg-gray-100',
                    'text-gray-700'
                );

                statusDot.classList.add(
                    'bg-gray-500'
                );

            }


            statusBadge.appendChild(statusDot);

            statusBadge.appendChild(
                document.createTextNode(status)
            );

            detailStatus.appendChild(statusBadge);
        }


        /*
        |--------------------------------------------------------------------------
        | Rejection Reason
        |--------------------------------------------------------------------------
        */

        if (
            detailRejectionContainer &&
            detailRejectionReason
        ) {

            if (
                status === 'Rejected' &&
                rejectionReason.trim() !== ''
            ) {

                detailRejectionContainer.classList.remove(
                    'hidden'
                );

                detailRejectionReason.textContent =
                    rejectionReason;

            } else {

                detailRejectionContainer.classList.add(
                    'hidden'
                );

                detailRejectionReason.textContent = '';

            }

        }


        /*
        |--------------------------------------------------------------------------
        | Show Modal
        |--------------------------------------------------------------------------
        */

        leaveDetailsModal.classList.remove(
            'hidden'
        );

        leaveDetailsModal.classList.add(
            'flex'
        );

        document.body.classList.add(
            'overflow-hidden'
        );
    };


    /*
    |--------------------------------------------------------------------------
    | Close View Modal
    |--------------------------------------------------------------------------
    */

    const closeLeaveDetailsModal = () => {

        if (!leaveDetailsModal) {
            return;
        }

        leaveDetailsModal.classList.add(
            'hidden'
        );

        leaveDetailsModal.classList.remove(
            'flex'
        );

        document.body.classList.remove(
            'overflow-hidden'
        );
    };


    /*
    |--------------------------------------------------------------------------
    | View Buttons
    |--------------------------------------------------------------------------
    */

    const viewLeaveButtons =
        document.querySelectorAll('.view-leave-btn');


    viewLeaveButtons.forEach(button => {

        button.addEventListener('click', () => {

            openLeaveDetailsModal(button);

        });

    });


    /*
    |--------------------------------------------------------------------------
    | Close View Modal Buttons
    |--------------------------------------------------------------------------
    */

    if (closeLeaveDetailsModalButton) {

        closeLeaveDetailsModalButton.addEventListener(
            'click',
            closeLeaveDetailsModal
        );

    }

    if (closeLeaveDetailsButton) {

        closeLeaveDetailsButton.addEventListener(
            'click',
            closeLeaveDetailsModal
        );

    }


    /*
    |--------------------------------------------------------------------------
    | Search + Status Filter
    |--------------------------------------------------------------------------
    */

    const searchInput =
        document.getElementById('leave-search');

    const statusFilter =
        document.getElementById('leave-status-filter');

    const leaveRows =
        document.querySelectorAll('.leave-row');

    const noFilteredResults =
        document.getElementById(
            'no-filtered-leave-records'
        );


    const filterLeaves = () => {

        const searchValue =
            searchInput
                ? searchInput.value
                    .trim()
                    .toLowerCase()
                : '';


        const selectedStatus =
            statusFilter
                ? statusFilter.value
                    .trim()
                    .toLowerCase()
                : '';


        let visibleRows = 0;


        leaveRows.forEach(row => {

            /*
            |--------------------------------------------------------------------------
            | Search Data
            |--------------------------------------------------------------------------
            */

            const searchText =
                (
                    row.dataset.search ||
                    row.textContent ||
                    ''
                ).toLowerCase();


            /*
            |--------------------------------------------------------------------------
            | Status Data
            |--------------------------------------------------------------------------
            */

            const rowStatus =
                (
                    row.dataset.status ||
                    ''
                ).toLowerCase();


            /*
            |--------------------------------------------------------------------------
            | Match Search
            |--------------------------------------------------------------------------
            */

            const matchesSearch =
                searchValue === '' ||
                searchText.includes(searchValue);


            /*
            |--------------------------------------------------------------------------
            | Match Status
            |--------------------------------------------------------------------------
            */

            const matchesStatus =
                selectedStatus === '' ||
                rowStatus === selectedStatus;


            /*
            |--------------------------------------------------------------------------
            | Show / Hide
            |--------------------------------------------------------------------------
            */

            if (
                matchesSearch &&
                matchesStatus
            ) {

                row.classList.remove(
                    'hidden'
                );

                visibleRows++;

            } else {

                row.classList.add(
                    'hidden'
                );

            }

        });


        /*
        |--------------------------------------------------------------------------
        | No Results
        |--------------------------------------------------------------------------
        */

        if (noFilteredResults) {

            if (visibleRows === 0) {

                noFilteredResults.classList.remove(
                    'hidden'
                );

            } else {

                noFilteredResults.classList.add(
                    'hidden'
                );

            }

        }

    };


    /*
    |--------------------------------------------------------------------------
    | Search Event
    |--------------------------------------------------------------------------
    */

    if (searchInput) {

        searchInput.addEventListener(
            'input',
            filterLeaves
        );

    }


    /*
    |--------------------------------------------------------------------------
    | Status Filter Event
    |--------------------------------------------------------------------------
    */

    if (statusFilter) {

        statusFilter.addEventListener(
            'change',
            filterLeaves
        );

    }


    /*
    |--------------------------------------------------------------------------
    | Close Request Modal When Clicking Outside
    |--------------------------------------------------------------------------
    */

    if (leaveRequestModal) {

        leaveRequestModal.addEventListener(
            'click',
            event => {

                if (
                    event.target ===
                    leaveRequestModal
                ) {

                    closeLeaveRequestModal();

                }

            }
        );

    }


    /*
    |--------------------------------------------------------------------------
    | Close Details Modal When Clicking Outside
    |--------------------------------------------------------------------------
    */

    if (leaveDetailsModal) {

        leaveDetailsModal.addEventListener(
            'click',
            event => {

                if (
                    event.target ===
                    leaveDetailsModal
                ) {

                    closeLeaveDetailsModal();

                }

            }
        );

    }


    /*
    |--------------------------------------------------------------------------
    | Escape Key
    |--------------------------------------------------------------------------
    */

    document.addEventListener(
        'keydown',
        event => {

            if (event.key !== 'Escape') {
                return;
            }

            closeLeaveRequestModal();
            closeLeaveDetailsModal();

        }
    );

});
