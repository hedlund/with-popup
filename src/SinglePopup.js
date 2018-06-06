import React, { Component, Fragment } from 'react';

export default config => {
  const render = typeof config === 'function' ? config : config.render;

  return WrappedComponent =>
    class extends Component {
      constructor(props) {
        super(props);
        this.show = this.show.bind(this);
        this.hide = this.hide.bind(this);
        this.state = {
          isShowing: false,
          initialProps: null,
        };
      }

      show(initialProps = null) {
        this.setState({
          isShowing: true,
          initialProps,
        });
      }

      hide(...args) {
        this.setState({
          isShowing: false,
        });
        if (config.onClose) {
          config.onClose(this.state.initialProps, ...args);
        }
      }

      render() {
        const { popup, ...props } = this.props;
        const { isShowing, initialProps } = this.state;
        return (
          <Fragment>
            <WrappedComponent {...props} popup={initProps => () => this.show(initProps)} />
            {isShowing &&
              render({
                ...initialProps,
                ...popup,
                handleClose: this.hide,
              })}
          </Fragment>
        );
      }
    };
};
